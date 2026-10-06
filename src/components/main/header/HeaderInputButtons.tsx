"use client";

import { PiHeart as HeartIcon } from "react-icons/pi";
import { LuUser as UserIcon } from "react-icons/lu";
import { GrCart as CartIcon } from "react-icons/gr";
import { FiSearch as SearchIcon } from "react-icons/fi";
import { useRecoilValue } from "recoil";
import {
  cartProductsState,
  favoriteProductsState,
} from "@/shared/recoil_states/atoms";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useRef } from "react";
import { ILangPropsToComponent } from "@/shared/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  homeBestSellingSwiper,
  homeProductsSwiper,
  homeSalesSwiper,
} from "@/data";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function HeaderInputButtons({
  dict,
  lang,
}: { dict: any } & ILangPropsToComponent) {
  const amountOfFavorites = useRecoilValue(favoriteProductsState);
  const [amount, setAmount] = useState(0);
  const amountOfCart = useRecoilValue(cartProductsState);
  const [amountCart, setAmountCart] = useState(0);
  const [isLogged, setIsLogged] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeResult, setActiveResult] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const products = useMemo(() => {
    const unique = new Map<string, (typeof homeSalesSwiper)[number]>();
    [...homeSalesSwiper, ...homeBestSellingSwiper, ...homeProductsSwiper].forEach(
      (product) => unique.set(product.name.trim().toLowerCase(), product)
    );
    return Array.from(unique.values());
  }, []);

  const searchResults = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return [];
    return products
      .filter((product) =>
        product.name.toLocaleLowerCase().includes(normalizedQuery)
      )
      .slice(0, 6);
  }, [products, query]);

  const openProduct = (index = 0) => {
    const product = searchResults[index];
    if (!product) return;
    setIsSearchOpen(false);
    setActiveResult(-1);
    router.push(`/${lang}/product/${slugify(product.name)}`);
  };

  useEffect(() => {
    setAmount(amountOfFavorites.length);
  }, [amountOfFavorites]);

  useEffect(() => {
    setAmountCart(
      amountOfCart.reduce((prev, current) => prev + current.amount, 0)
    );
  }, [amountOfCart]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setIsLogged(Boolean(data.session)));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLogged(Boolean(session));
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const closeSearch = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setActiveResult(-1);
      }
    };
    document.addEventListener("mousedown", closeSearch);
    return () => document.removeEventListener("mousedown", closeSearch);
  }, []);

  return (
    <>
      <div
        ref={searchRef}
        className="relative flex items-center bg-color-secondary px-6 py-3 gap-4
      max-3xl:px-5 max-3xl:py-2 max-lg:mr-auto max-sm:flex-1 max-sm:px-3"
      >
        <input
          type="text"
          value={query}
          placeholder={dict.header.searchPlaceholder}
          aria-label={dict.header.searchPlaceholder}
          role="combobox"
          aria-expanded={isSearchOpen}
          aria-controls="header-search-results"
          autoComplete="off"
          onFocus={() => setIsSearchOpen(Boolean(query.trim()))}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsSearchOpen(Boolean(event.target.value.trim()));
            setActiveResult(-1);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsSearchOpen(false);
              setActiveResult(-1);
              return;
            }
            if (!searchResults.length) return;
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setIsSearchOpen(true);
              setActiveResult((current) =>
                current >= searchResults.length - 1 ? 0 : current + 1
              );
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setIsSearchOpen(true);
              setActiveResult((current) =>
                current <= 0 ? searchResults.length - 1 : current - 1
              );
            }
            if (event.key === "Enter") {
              event.preventDefault();
              openProduct(activeResult >= 0 ? activeResult : 0);
            }
          }}
          className="text-sm placeholder:text-color-text-2 bg-transparent outline-none
          max-2xl:text-xs max-sm:min-w-0 max-sm:w-full"
        />
        <button
          type="button"
          aria-label="Найти товар"
          onClick={() => openProduct(activeResult >= 0 ? activeResult : 0)}
        >
          <SearchIcon className="w-7 h-7 cursor-pointer max-3xl:w-6 max-3xl:h-6 max-2xl:w-5 max-2xl:h-5" />
        </button>

        {isSearchOpen && (
          <div
            id="header-search-results"
            role="listbox"
            className="absolute left-0 top-[calc(100%+8px)] z-[700] w-[min(430px,calc(100vw-32px))]
              overflow-hidden rounded-xl border border-black/10 bg-white shadow-2xl"
          >
            {searchResults.length ? (
              searchResults.map((product, index) => {
                const discountedPrice = product.discount
                  ? Math.round(product.price * (1 - product.discount / 100))
                  : product.price;
                return (
                  <Link
                    key={product.name}
                    role="option"
                    aria-selected={activeResult === index}
                    href={`/${lang}/product/${slugify(product.name)}`}
                    onMouseEnter={() => setActiveResult(index)}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setActiveResult(-1);
                    }}
                    className={`flex items-center gap-3 border-b border-black/5 px-3 py-2.5 last:border-0
                      ${activeResult === index ? "bg-color-secondary" : "bg-white hover:bg-color-secondary"}`}
                  >
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-color-secondary">
                      <Image
                        src={`/images/products/${product.images[0]}`}
                        alt=""
                        width={56}
                        height={56}
                        className="h-12 w-12 object-contain"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-black">
                        {product.name}
                      </span>
                      <span className="mt-1 flex items-center gap-2 text-sm">
                        <span className="font-semibold text-color-secondary-2">
                          ${discountedPrice}
                        </span>
                        {product.discount && (
                          <span className="text-xs text-color-text-2 line-through">
                            ${product.price}
                          </span>
                        )}
                      </span>
                    </span>
                  </Link>
                );
              })
            ) : (
              <p className="px-4 py-4 text-sm text-color-text-2">
                {lang === "ru"
                  ? "Товар не найден"
                  : lang === "tm"
                    ? "Haryt tapylmady"
                    : "No products found"}
              </p>
            )}
          </div>
        )}
      </div>
      <Link href={`/${lang}/wishlist`} className="relative cursor-pointer">
        {amount > 0 && <AmountOfItems text={amount.toString()} />}
        <HeartIcon className="w-8 h-8 max-3xl:w-7 max-3xl:h-7 max-2xl:w-6 max-2xl:h-6" />
      </Link>
      <Link href={`/${lang}/cart`} className="relative cursor-pointer">
        {amountCart > 0 && (
          <AmountOfItems
            text={amountCart > 99 ? `${amountCart}+` : amountCart.toString()}
          />
        )}
        <CartIcon className="w-7 h-7 max-3xl:w-6 max-3xl:h-6 max-2xl:w-5 max-2xl:h-5" />
      </Link>
      <Link
        href={isLogged ? `/${lang}/account` : `/${lang}/login`}
        aria-label={isLogged ? "Открыть профиль" : "Войти в аккаунт"}
        title={isLogged ? "Профиль" : "Войти"}
      >
        <UserIcon className="w-7 h-7 max-3xl:w-6 max-3xl:h-6 max-2xl:w-5 max-2xl:h-5" />
      </Link>
    </>
  );
}

function AmountOfItems({ text }: { text: string }) {
  return (
    <p
      className="text-sm text-color-text-1 bg-color-secondary-2 rounded-full absolute -top-3 -right-3 w-6 h-6
    flex items-center justify-center
    max-3xl:w-5 max-3xl:h-5 max-3xl:-top-2 max-3xl:-right-2
    max-2xl:text-[10px] max-2xl:h-4 max-2xl:w-4 max-2xl:-right-[6px]"
    >
      {text}
    </p>
  );
}
