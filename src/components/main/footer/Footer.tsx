import { horizontalMarginLimit } from "@/shared/constants";
import { interBoldFont, poppinsMediumFont } from "fonts";
import FooterInput from "./FooterInput";
import FooterLink from "./FooterLink";
import { IClassName } from "types";
import { AiOutlineCopyright as CopyRightIcon } from "react-icons/ai";
import Image from "next/image";
import Link from "next/link";
import { twMerge as tw } from "tailwind-merge";
import { AiOutlineInstagram as InstagramIcon } from "react-icons/ai";
import { FaTelegramPlane as TelegramIcon, FaVk as VkIcon } from "react-icons/fa";
import SiteQrCode from "./SiteQrCode";
import { TLanguages } from "@/shared/types";

export default function Footer({ locale, dict }: { locale: TLanguages; dict: any }) {
  const qrText = locale === "ru" ? "Открыть сайт на телефоне" : locale === "tm" ? "Saýty telefonda açyň" : "Open the site on your phone";
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/";
  const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/";
  const vkUrl = process.env.NEXT_PUBLIC_VK_URL || "https://vk.com/";
  return (
    <footer className="bg-color-bg-1 text-color-text-1">
      <div
        className={tw(
          `mt-16 mb-14 flex flex-wrap gap-10
          max-3xl:mt-14 max-3xl:mb-12 max-lg:grid max-lg:grid-cols-2 max-sm:grid-cols-1`,
          horizontalMarginLimit
        )}
      >
        <div className="flex flex-col items-start gap-3 flex-[1_0_17%] max-3xl:flex-[1_0_20%]">
          <Link
            href={`/${locale}`}
            className={tw("text-3xl mb-3", interBoldFont.className)}
          >
            Exlusive
          </Link>
          <FooterTitle
            text={dict.footer.otherTexts.subscribe}
            className="mb-0 max-2xl:mb-0"
          />
          <div className="space-y-2">
            <p className="text-lg max-2xl:text-base">
              {dict.footer.otherTexts["10%Off"]}
            </p>
            <FooterInput dict={dict} />
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 flex-[1_0_17%] max-3xl:flex-[1_0_20%]">
          <FooterTitle text={dict.footer.otherTexts.support} />
          {dict.footer.footerNav.map((item: any, i: number) => (
            <FooterLink key={i} {...item} isIndependent />
          ))}
        </div>
        <div className="flex flex-col items-start gap-3 flex-[1_0_10%] max-3xl:flex-[1_0_20%]">
          <FooterTitle text={dict.footer.otherTexts.account} />
          {dict.footer.footerNav1.map((item: any, i: number) => (
            <FooterLink isIndependent={false} key={i} {...item} />
          ))}
        </div>
        <div className="flex flex-col items-start gap-3 flex-[1_0_10%] max-3xl:flex-[1_0_20%]">
          <FooterTitle text={dict.footer.otherTexts.quickLink} />
          {dict.footer.footerNav2.map((item: any, i: number) => (
            <FooterLink isIndependent={false} key={i} {...item} />
          ))}
        </div>
        <div className="flex flex-col items-start gap-3 flex-[1_0_19%] max-3xl:flex-[1_0_20%]">
          <FooterTitle text={qrText} />
          <div className="space-y-2">
            <p
              className={tw(
                "text-color-text-2 max-w-[280px] text-base max-2xl:text-sm",
                poppinsMediumFont.className
              )}
            >
              {qrText}
            </p>
            <div className="flex gap-2 items-center"><SiteQrCode /></div>
            <div className="flex items-center gap-6 pt-4">
              <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram">
                <InstagramIcon className="w-7 h-7 object-contain max-2xl:w-6 max-2xl:h-6" />
              </a>
              <a href={telegramUrl} target="_blank" rel="noreferrer" aria-label="Telegram">
                <TelegramIcon className="w-7 h-7 object-contain max-2xl:w-6 max-2xl:h-6" />
              </a>
              <a href={vkUrl} target="_blank" rel="noreferrer" aria-label="VK">
                <VkIcon className="w-7 h-7 object-contain max-2xl:w-6 max-2xl:h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center border-t-[1px] border-color-footer-copyright gap-2 text-color-footer-copyright py-3">
        <CopyRightIcon className="w-6 h-6 max-2xl:w-5 max-2xl:h-5" />
        <p className="text-lg max-2xl:text-base max-sm:text-center max-sm:text-sm">
          {dict.footer.otherTexts.copyRight}
        </p>
      </div>
    </footer>
  );
}

function FooterTitle({ className, text }: IClassName & { text: string }) {
  return (
    <h3
      className={tw(
        `text-[22px] capitalize mb-3
        max-2xl:mb-2 max-2xl:text-xl`,
        poppinsMediumFont.className,
        className
      )}
    >
      {text}
    </h3>
  );
}
