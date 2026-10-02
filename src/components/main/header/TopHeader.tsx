import { horizontalMarginLimit } from "@/shared/constants";
import Link from "next/link";
import { twMerge as tw } from "tailwind-merge";
import { poppinsSemiBoldFont } from "fonts";
import HeaderLangDropdown from "./HeaderLangDropdown";
import { TLanguages } from "@/shared/types";

export default function TopHeader({ locale, dict }: { locale: TLanguages; dict: any }) {

  return (
    <div className="bg-color-bg-1 text-color-text-1">
      <div
        className={tw(
          `flex items-center justify-center relative py-3 max-lg:justify-between max-lg:gap-4`,
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
        <div className="absolute right-0 top-2/4 w-36 -translate-y-2/4 max-lg:static max-lg:w-28 max-lg:shrink-0 max-lg:translate-y-0 max-sm:w-24">
          <HeaderLangDropdown lang={locale} />
        </div>
      </div>
    </div>
  );
}
