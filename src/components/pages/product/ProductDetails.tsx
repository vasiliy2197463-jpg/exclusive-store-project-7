"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { IProductCard, TLanguages } from "@/shared/types";
import { cartProductsState, favoriteProductsState } from "@/shared/recoil_states/atoms";
import { addNewItemToCart } from "@/shared/utils";
import { PiHeart, PiHeartFill, PiStar, PiStarFill } from "react-icons/pi";

const copy = {
  ru: { back: "Назад в магазин", add: "Добавить в корзину", added: "Добавлено в корзину", color: "Цвет", gallery: "Фотографии товара", rate: "Оценить товар", review: "Ваш отзыв", send: "Отправить оценку", saved: "Спасибо! Ваша оценка сохранена.", description: "Описание", text: "Оригинальный товар магазина Exclusive. Посмотрите фотографии с разных ракурсов, выберите цвет и добавьте товар в корзину." },
  en: { back: "Back to shop", add: "Add to cart", added: "Added to cart", color: "Color", gallery: "Product photos", rate: "Rate this product", review: "Your review", send: "Submit rating", saved: "Thank you! Your rating has been saved.", description: "Description", text: "An original Exclusive store product. Explore the gallery, choose a color and add the item to your cart." },
  tm: { back: "Dükana dolan", add: "Sebede goş", added: "Sebede goşuldy", color: "Reňk", gallery: "Harydyň suratlary", rate: "Haryda baha beriň", review: "Siziň synyňyz", send: "Bahany iber", saved: "Sag boluň! Bahaňyz ýazga alyndy.", description: "Düşündiriş", text: "Exclusive dükanynyň harydy. Suratlary görüň, reňki saýlaň we sebede goşuň." },
};

export default function ProductDetails({ product, locale }: { product: IProductCard; locale: TLanguages }) {
  const text = copy[locale] || copy.ru;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [saved, setSaved] = useState(false);
  const [cart, setCart] = useRecoilState(cartProductsState);
  const [favorites, setFavorites] = useRecoilState(favoriteProductsState);
  const favorite = favorites.some((item) => item.name === product.name);

  useEffect(() => {
    try {
      const value = JSON.parse(localStorage.getItem(`rating:${product.name}`) || "null");
      if (value?.rating) {
        setRating(value.rating);
        setReview(value.review || "");
      }
    } catch {}
  }, [product.name]);

  function addToCart() {
    if (cart.some((item) => item.name === product.name)) return;
    setCart(addNewItemToCart({ amount: 1, cartProducts: cart, isFavorite: favorite, props: product }));
  }

  function toggleFavorite() {
    setFavorites((items) => favorite ? items.filter((item) => item.name !== product.name) : [...items, { ...product, isFavorite: true }]);
  }

  function saveRating(event: FormEvent) {
    event.preventDefault();
    if (!rating) return;
    localStorage.setItem(`rating:${product.name}`, JSON.stringify({ rating, review, createdAt: new Date().toISOString() }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 5000);
  }

  const price = product.discount ? product.price - (product.price / 100) * product.discount : product.price;

  return (
    <section className="mx-auto w-full max-w-[1500px] px-5 py-10 sm:px-8 lg:py-16">
      <a href={`/${locale}/shop`} className="underline underline-offset-4">← {text.back}</a>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,.85fr)]">
        <div className="grid gap-4 sm:grid-cols-[100px_minmax(0,1fr)]">
          <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col">
            {product.images.map((image, index) => (
              <button key={image} onClick={() => setSelectedImage(index)} className={`h-24 w-24 shrink-0 rounded-2xl border bg-neutral-100 p-2 ${selectedImage === index ? "border-black" : "border-transparent"}`}>
                <Image src={`${basePath}/images/products/${image}`} alt={`${product.name}, фото ${index + 1}`} width={120} height={120} className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
          <div className="order-1 relative flex aspect-square items-center justify-center rounded-3xl bg-neutral-100 p-8 sm:order-2">
            <Image src={`${basePath}/images/products/${product.images[selectedImage]}`} alt={product.name} width={900} height={900} priority className="h-full w-full object-contain" />
            <button onClick={toggleFavorite} aria-label="Избранное" className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow">
              {favorite ? <PiHeartFill className="h-6 w-6 text-red-500" /> : <PiHeart className="h-6 w-6" />}
            </button>
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-black sm:text-5xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-2 text-amber-400">
            {product.rating.map((value, index) => value ? <PiStarFill key={index} /> : <PiStar key={index} />)}
            <span className="text-sm text-neutral-500">({product.ratingAmount})</span>
          </div>
          <div className="mt-5 flex items-end gap-3">
            <span className="text-3xl font-bold text-red-500">${price}</span>
            {product.discount && <span className="text-xl text-neutral-400 line-through">${product.price}</span>}
          </div>
          <h2 className="mt-8 font-bold">{text.description}</h2>
          <p className="mt-2 leading-7 text-neutral-600">{text.text}</p>
          {product.colors?.length ? (
            <div className="mt-7">
              <p className="font-bold">{text.color}</p>
              <div className="mt-3 flex gap-3">
                {product.colors.map((color) => <button key={color} onClick={() => setSelectedColor(color)} aria-label={color} className={`h-9 w-9 rounded-full border-2 border-white outline ${selectedColor === color ? "outline-2 outline-black" : "outline-1 outline-neutral-300"}`} style={{ backgroundColor: color }} />)}
              </div>
            </div>
          ) : null}
          <button onClick={addToCart} className="mt-8 w-full rounded-xl bg-black px-6 py-4 font-bold text-white">
            {cart.some((item) => item.name === product.name) ? text.added : text.add}
          </button>
        </div>
      </div>
      <form onSubmit={saveRating} className="mt-12 rounded-3xl border p-5 sm:p-8">
        <h2 className="text-2xl font-black">{text.rate}</h2>
        <div className="mt-4 flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} onClick={() => setRating(value)} aria-label={`${value} из 5`}>{value <= rating ? <PiStarFill className="h-9 w-9 text-amber-400" /> : <PiStar className="h-9 w-9 text-neutral-300" />}</button>)}
        </div>
        <textarea value={review} onChange={(event) => setReview(event.target.value)} placeholder={text.review} className="mt-5 min-h-28 w-full rounded-xl border p-4" />
        <button disabled={!rating} className="mt-3 rounded-xl bg-black px-6 py-3 font-bold text-white disabled:opacity-40">{text.send}</button>
        {saved && <p className="mt-3 text-emerald-700">{text.saved}</p>}
      </form>
    </section>
  );
}
