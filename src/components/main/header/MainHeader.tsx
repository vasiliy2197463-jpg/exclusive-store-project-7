"use client";

import { horizontalMarginLimit } from "@/shared/constants";
import { twMerge as tw } from "tailwind-merge";
import { interBoldFont } from "fonts";
import HeaderLink from "./HeaderLink";
import HeaderInputButtons from "./HeaderInputButtons";
import Link from "next/link";
import { TLanguages } from "@/shared/types";
import HeaderLangDropdown from "./HeaderLangDropdown";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";

export default function MainHeader({ locale, dict }: { locale: TLanguages; dict: any }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <div className="bg-color-bg text-color-text-3 border-b border-color-divider">
      <div
        className={tw(
          `flex items-center justify-between pt-9 pb-4 max-2xl:pt-7 max-2xl:pb-3 max-lg:flex-wrap max-lg:gap-5 max-lg:pt-5`,
          horizontalMarginLimit
        )}
      >
        <div className="flex w-full min-w-0 items-center justify-between gap-4 lg:w-auto">
          <Link
            href={`/${locale}`}
            className={tw("shrink-0 text-3xl max-2xl:text-2xl", interBoldFont.className)}
          >
            Exclusive
          </Link>
          <div className="flex items-center gap-2 lg:hidden">
            <div className="relative z-[90]"><HeaderLangDropdown lang={locale} /></div>
            <button type="button" onClick={() => setMenuOpen(true)} aria-label="Открыть меню" className="flex h-10 w-10 items-center justify-center rounded-lg border">
              <FiMenu className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-52 max-3xl:gap-40 max-2xl:gap-24 max-lg:w-full max-lg:flex-col max-lg:items-stretch max-lg:gap-4">
          <nav className="flex items-center gap-12 max-3xl:gap-10 max-2xl:gap-8 max-lg:hidden">
            {dict.header.links.map((item: any, i: number) => (
              <HeaderLink {...item} key={i} />
            ))}
          </nav>
          <div
            className="flex items-center gap-6 max-3xl:gap-5 max-lg:w-full max-lg:justify-end max-sm:gap-4"
          >
            <div className="relative z-[90] max-lg:hidden"><HeaderLangDropdown lang={locale} /></div>
            <HeaderInputButtons dict={dict} lang={locale} />
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="fixed inset-0 z-[500] lg:hidden">
          <button aria-label="Закрыть меню" onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-black/50" />
          <aside className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-5">
              <span className={tw("text-2xl", interBoldFont.className)}>Exclusive</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Закрыть меню" className="flex h-10 w-10 items-center justify-center rounded-full border"><FiX className="h-6 w-6" /></button>
            </div>
            <nav className="mt-6 flex flex-col gap-1">
              {dict.header.links.map((item: any, i: number) => (
                <div key={i} className="border-b py-3"><HeaderLink {...item} /></div>
              ))}
              {[
                ["Магазин", "shop"],
                ["Избранное", "wishlist"],
                ["Корзина", "cart"],
                ["Аккаунт", "account"],
                ["Частые вопросы", "faq"],
              ].map(([label, href]) => (
                <Link key={href} href={`/${locale}/${href}`} className="border-b py-3 text-sm font-medium">{label}</Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}
