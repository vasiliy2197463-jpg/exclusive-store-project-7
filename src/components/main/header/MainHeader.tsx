import { horizontalMarginLimit } from "@/shared/constants";
import { twMerge as tw } from "tailwind-merge";
import { interBoldFont } from "fonts";
import HeaderLink from "./HeaderLink";
import HeaderInputButtons from "./HeaderInputButtons";
import Link from "next/link";
import { TLanguages } from "@/shared/types";

export default function MainHeader({ locale, dict }: { locale: TLanguages; dict: any }) {

  return (
    <div className="bg-color-bg text-color-text-3 border-b border-color-divider">
      <div
        className={tw(
          `flex items-center justify-between pt-9 pb-4 max-2xl:pt-7 max-2xl:pb-3 max-lg:flex-wrap max-lg:gap-5 max-lg:pt-5`,
          horizontalMarginLimit
        )}
      >
        <Link
          href={`/${locale}`}
          className={tw("text-3xl max-2xl:text-2xl", interBoldFont.className)}
        >
          Exlusive
        </Link>
        <div className="flex items-center gap-52 max-3xl:gap-40 max-2xl:gap-24 max-lg:w-full max-lg:flex-col max-lg:items-stretch max-lg:gap-4">
          <nav className="flex items-center gap-12 max-3xl:gap-10 max-2xl:gap-8 max-lg:order-2 max-lg:gap-6 max-lg:overflow-x-auto max-lg:pb-2 max-sm:grid max-sm:grid-cols-2 max-sm:gap-x-6 max-sm:gap-y-3 max-sm:overflow-visible">
            {dict.header.links.map((item: any, i: number) => (
              <HeaderLink {...item} key={i} />
            ))}
          </nav>
          <div
            className="flex items-center gap-6 max-3xl:gap-5 max-lg:w-full max-lg:justify-end max-sm:gap-4"
          >
            <HeaderInputButtons dict={dict} lang={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
