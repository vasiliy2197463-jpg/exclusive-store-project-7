"use client";

import { INavigationTrain } from "types";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { twMerge as tw } from "tailwind-merge";
import { horizontalMarginLimit } from "@/shared/constants";

const labels: Record<string, Record<string, string>> = {
  ru: { home: "Главная", cart: "Корзина", account: "Аккаунт", wishlist: "Избранное", contact: "Контакты", about: "О нас", login: "Вход", "sign-up": "Регистрация", admin: "Админ-панель", shop: "Магазин", "check-out": "Оформление заказа" },
  tm: { home: "Baş sahypa", cart: "Sebet", account: "Akkaunt", wishlist: "Halananlar", contact: "Habarlaşmak", about: "Biz barada", login: "Giriş", "sign-up": "Registrasiýa", admin: "Admin paneli", shop: "Dükan", "check-out": "Sargyt" },
  en: { home: "Home", cart: "Cart", account: "Account", wishlist: "Wishlist", contact: "Contact", about: "About", login: "Login", "sign-up": "Sign Up", admin: "Admin panel", shop: "Shop", "check-out": "Checkout" },
};

export default function NavigationTrain({
  isNotFound,
  isError,
}: INavigationTrain) {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const locale = (["en", "ru", "tm"].includes(parts[0]) ? parts[0] : "ru");
  const pathArray = parts.slice(1);
  const text = (key: string) => labels[locale]?.[key] || key.replace(/-/g, " ");

  return (
    <div
      className={tw(
        "absolute top-14 left-0 max-2xl:top-12",
        horizontalMarginLimit
      )}
    >
      <div
        className="flex items-center gap-3 py-2 text-color-text-2 text-base
              max-2xl:text-sm"
      >
        <>
          {isNotFound ? (
            <>
              <Link
                href={`/${locale}`}
                className="duration-300 ease-in-out transition-colors hover:text-color-text-2-hover"
              >
                {text("home")}
              </Link>
              <span className="italic">/</span>
              <span className="text-color-text-3">404</span>
            </>
          ) : (
            ["home", ...pathArray].map((item, i, all) => {
              const isLast = i === all.length - 1;
              const href = i === 0 ? `/${locale}` : `/${locale}/${pathArray.slice(0, i).join("/")}`;
              return <div key={`${item}-${i}`} className={`flex items-center gap-3 ${isLast ? "text-color-text-3" : "text-color-text-2"}`}><Link href={href} className="capitalize transition-colors duration-300 hover:text-color-text-2-hover">{text(item)}</Link>{!isLast&&<span className="italic">/</span>}</div>;
            })
          )}
        </>
        {isError && (
          <>
            <Link
              href={`/${locale}`}
              className="duration-300 ease-in-out transition-colors hover:text-color-text-2-hover"
            >
              {text("home")}
            </Link>
            <span className="italic">/</span>
            <span className="text-color-text-3">500 Error</span>
          </>
        )}
      </div>
    </div>
  );
}
