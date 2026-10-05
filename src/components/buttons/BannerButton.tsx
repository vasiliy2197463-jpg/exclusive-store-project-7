"use client";

import { IBannerButton } from "types";
import { AiOutlineArrowRight as ArrowIcon } from "react-icons/ai";
import { twMerge as tw } from "tailwind-merge";
import { poppinsMediumFont } from "fonts";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { cartProductsState } from "@/shared/recoil_states/atoms";
import { addNewItemToCart } from "@/shared/utils";
import { homeBestSellingSwiper, homeProductsSwiper, homeSalesSwiper } from "@/data";

const slugifyProduct = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9а-яё]+/gi, "-").replace(/^-|-$/g, "");

export default function BannerButton({ text, href = "#", className }: IBannerButton & { className?: string }) {
  const router = useRouter();
  const [cart, setCart] = useRecoilState(cartProductsState);

  function buyNow() {
    const marker = "/product/";
    const slug = href.includes(marker) ? href.split(marker)[1].split(/[/?#]/)[0] : "";
    const product = [...homeSalesSwiper, ...homeBestSellingSwiper, ...homeProductsSwiper]
      .find((item) => slugifyProduct(item.name) === slug);
    if (product && !cart.some((item) => item.name === product.name)) {
      setCart(addNewItemToCart({ amount: 1, cartProducts: cart, isFavorite: false, props: product }));
    }
    const locale = href.split("/").filter(Boolean)[0] || "ru";
    router.push(product ? `/${locale}/cart` : href);
  }

  return (
    <button
      type="button"
      onClick={buyNow}
      className={tw(
        `flex items-center gap-4 text-color-text-1 bg-transparent group`,
        poppinsMediumFont.className,
        className,
      )}
    >
      <p className="underline capitalize underline-offset-[10px] text-lg max-2xl:text-base">
        {text}
      </p>
      <ArrowIcon className="w-6 h-6 opacity-0 -translate-x-4 duration-300 ease-in-out transition-all group-hover:translate-x-0 group-hover:opacity-100" />
    </button>
  );
}
