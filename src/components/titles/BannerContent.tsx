import { IBannerContent } from "types";
import BannerButton from "../buttons/BannerButton";
import { twMerge as tw } from "tailwind-merge";
import { poppinsSemiBoldFont } from "fonts";
import { TLanguages } from "@/shared/types";

export default async function BannerContent({
  description,
  title,
  className,
  locale,
  href,
}: IBannerContent & { locale: TLanguages }) {
  return (
    <div className={tw("space-y-4", className)}>
      <div className="text-color-text-1 space-y-1">
        <p
          className={tw(
            "text-[26px] capitalize max-2xl:text-2xl",
            poppinsSemiBoldFont.className
          )}
        >
          {title}
        </p>
        <p className="text-base max-2xl:text-sm">{description}</p>
      </div>
      <BannerButton
        href={href}
        text={
          locale === "en"
            ? "shop now"
            : locale === "ru"
            ? "Купить сейчас"
            : "Satyn almak"
        }
      />
    </div>
  );
}
