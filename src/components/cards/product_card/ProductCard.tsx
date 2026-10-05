"use client";

import { IProductCard } from "types";
import Image from "next/image";
import {
  PiHeart as HeartIcon,
  PiHeartFill as FilledHeartIcon,
} from "react-icons/pi";
import { poppinsMediumFont, poppinsSemiBoldFont } from "fonts";
import RatingStar from "./RatingStar";
import EmptyStar from "./EmptyStar";
import SemiStar from "./SemiStar";
import { useState, useEffect } from "react";
import { twMerge as tw } from "tailwind-merge";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { useRecoilState } from "recoil";
import {
  cartProductsState,
  favoriteProductsState,
} from "@/shared/recoil_states/atoms";
import {
  addNewItemToCart,
  decreaseAmount,
  editExistItemInCart,
  increaseAmount,
  removeItemFromCartViaIndex,
} from "@/shared/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const slugifyProduct = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-|-$/g, "");

export default function ProductCard(props: IProductCard) {
  const { images, name, price, rating, ratingAmount, colors, discount, isNew } =
    props;
  const [color, setColor] = useState(colors ? colors[0] : "");
  const [favoriteProducts, setFavoriteProducts] = useRecoilState(
    favoriteProductsState
  );
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [amount, setAmount] = useState(0);
  const [cartProducts, setCartProducts] = useRecoilState(cartProductsState);
  const locale = usePathname().split("/")[1] || "ru";
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  useEffect(() => {
    favoriteProducts.length > 0 &&
      setIsFavorite(favoriteProducts.some((item) => item.name === name));
  }, [favoriteProducts]);

  useEffect(() => {
    let tempArr = cartProducts.filter((item) => item.name === name);
    if (tempArr.length > 0) {
      setAmount(tempArr[0].amount);
    }
  }, [cartProducts]);

  useEffect(() => {
    let itemIndex = cartProducts.findIndex((value) => value.name === name);

    if (itemIndex !== -1) {
      if (amount > 0) {
        setCartProducts(
          editExistItemInCart({
            amount,
            cartProducts,
            isFavorite,
            itemIndex,
            props,
          })
        );
      } else {
        setCartProducts(
          removeItemFromCartViaIndex({ cartProducts, itemIndex })
        );
      }
    } else {
      if (amount > 0) {
        setCartProducts(
          addNewItemToCart({ amount, cartProducts, isFavorite, props })
        );
      }
    }
  }, [amount]);

  function handleFavoriteClick() {
    let index =
      favoriteProducts.length > 0
        ? favoriteProducts.findIndex((item) => item.name === name)
        : -1;

    if (index !== -1) {
      setFavoriteProducts((prev) => {
        return [...prev.slice(0, index), ...prev.slice(index + 1)];
      });
      setIsFavorite(false);
    } else {
      setFavoriteProducts((prev) => {
        return [...prev, { ...props, isFavorite }];
      });
      setIsFavorite(true);
    }
  }

  function getStar(item: number, i: number) {
    if (item === 1) {
      return <RatingStar key={i} />;
    } else if (item === 0) {
      return <EmptyStar key={i} />;
    } else {
      return <SemiStar key={i} />;
    }
  }

  return (
    <div className="group flex w-full min-w-0 flex-col items-start gap-3">
      <div className="relative flex aspect-square w-full min-w-0 items-center justify-center overflow-hidden bg-color-secondary p-8 max-sm:p-4">
        <Link
          href={`/${locale}/product/${slugifyProduct(name)}`}
          aria-label={`Открыть товар ${name}`}
          className="flex h-full w-full items-center justify-center"
        >
          <Image
            alt={name}
            src={`${basePath}/images/products/${images[0]}`}
            width={240}
            height={240}
            className="h-[72%] w-[72%] object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <>
          {amount !== 0 ? (
            <div
              className="absolute bottom-0 w-full py-2 bg-color-bg-1 hover:bg-color-bg-1 
            transition-all duration-300 ease-in-out rounded-tr-none 
            rounded-tl-none flex items-center justify-between rounded-sm text-color-text-1 px-4 text-xl
            max-2xl:text-base max-2xl:py-1 max-2xl:px-2 max-3xl:h-9
          "
            >
              <button
                onClick={() => setAmount(decreaseAmount(amount))}
                className="px-2 duration-300 transition-colors hover:bg-color-primary-1 text-center rounded-sm"
              >
                -
              </button>
              <p>{amount}</p>
              <button
                onClick={() => setAmount(increaseAmount(amount))}
                className="px-2 duration-300 transition-colors hover:bg-color-primary-1 text-center rounded-sm"
              >
                +
              </button>
            </div>
          ) : (
            <PrimaryButton
              buttonProps={{
                onClick: () => setAmount(increaseAmount(amount)),
              }}
              className="absolute bottom-0 w-full py-2 bg-color-bg-1 hover:bg-color-bg-1 group-hover:flex
              transition-all duration-300 ease-in-out rounded-tr-none rounded-tl-none
              max-2xl:text-base max-2xl:py-1 max-2xl:px-2 max-3xl:h-9"
            >
              add to cart
            </PrimaryButton>
          )}
        </>

        <>
          <div
            onClick={handleFavoriteClick}
            className="absolute right-2 top-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-color-bg sm:right-3 sm:h-10 sm:w-10"
          >
            <>
              {isFavorite ? (
                <FilledHeartIcon className="text-color-secondary-2 w-5 h-5" />
              ) : (
                <HeartIcon className="text-color-bg-1 w-5 h-5" />
              )}
            </>
          </div>
          <div className="absolute top-2 left-2 flex text-center gap-2">
            <>
              {isNew ? (
                <p className="uppercase text-color-text-1 rounded-md px-2 py-1 bg-color-button text-sm">
                  new
                </p>
              ) : null}
              {discount ? (
                <p className="uppercase text-color-text-1 rounded-md px-2 py-1 bg-color-button-1 text-sm">
                  -{discount}%
                </p>
              ) : null}
            </>
          </div>
        </>
      </div>
      <div
        className={`${poppinsMediumFont.className} grid min-w-0 w-full grid-rows-[auto_auto_auto] items-start gap-2`}
      >
        <Link
          href={`/${locale}/product/${slugifyProduct(name)}`}
          className="line-clamp-2 min-h-10 max-w-full break-words text-base leading-5 text-color-text-3 capitalize hover:underline sm:min-h-12 sm:text-lg sm:leading-6"
        >
          {name}
        </Link>
        <div className="flex min-h-7 flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-color-secondary-2 text-lg max-2xl:text-base">
              ${discount ? `${price - (price / 100) * discount}` : price}
            </p>
            {discount ? (
              <p className="text-color-text-2 line-through text-lg max-2xl:text-base">
                ${price}
              </p>
            ) : null}
        </div>
        <div className="flex min-h-7 items-center gap-1 overflow-hidden">
          <div className="flex shrink-0 items-center gap-1">{rating.map(getStar)}</div>
          <p
            className={`${poppinsSemiBoldFont.className} shrink-0 text-color-text-2 text-base max-2xl:text-sm`}
          >{`(${ratingAmount})`}</p>
        </div>

        {colors ? (
          <div className="flex items-center gap-2 mt-3">
            {colors.map((item, i) => {
              return (
                <div
                  className={tw(
                    "w-5 h-5 border-2 border-color-bg rounded-full cursor-pointer",
                    color === item ? "outline outline-2 outline-color-bg-1" : ""
                  )}
                  style={{ backgroundColor: item }}
                  key={i}
                  onClick={() => setColor(item)}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
