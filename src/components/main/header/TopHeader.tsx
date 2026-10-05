"use client";

import { horizontalMarginLimit } from "@/shared/constants";
import Link from "next/link";
import { twMerge as tw } from "tailwind-merge";
import { poppinsSemiBoldFont } from "fonts";
import { TLanguages } from "@/shared/types";
import { useState } from "react";
import { FiX } from "react-icons/fi";

export default function TopHeader({ locale, dict }: { locale: TLanguages; dict: any }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative z-[80] bg-color-bg-1 text-color-text-1">
      <div
        className={tw(
          `relative flex items-center justify-center py-3 pr-10 max-lg:justify-between max-lg:gap-3 max-sm:items-start max-sm:py-2`,
          horizontalMarginLimit
        )}
      >
        <div className="flex min-w-0 flex-1 items-center justify-center gap-3 text-center max-lg:justify-start max-lg:text-left">
          <p className="text-base max-2xl:text-sm max-lg:text-xs max-sm:text-[11px] max-sm:leading-4">
            {dict.header.topHeader.text}{" "}
            <Link
              className={tw(
                "underline cursor-pointer",
                poppinsSemiBoldFont.className
              )}
              href={`/${locale}`}
            >
              {dict.header.topHeader.href}
            </Link>
          </p>
        </div>
        <button type="button" aria-label="Скрыть акцию" onClick={()=>setVisible(false)} className="absolute right-0 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-white/80 hover:bg-white/15 hover:text-white"><FiX className="h-5 w-5"/></button>
      </div>
    </div>
  );
}
