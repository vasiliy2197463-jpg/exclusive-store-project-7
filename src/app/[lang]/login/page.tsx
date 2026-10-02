import {
  bottomMarginSaving,
  horizontalMarginLimit,
  topMarginSaving,
} from "@/shared/constants";
import Image from "next/image";
import { twMerge as tw } from "tailwind-merge";
import { interMediumFont } from "fonts";
import { getLocaleInServer } from "@/shared/utils";
import { headers } from "next/headers";
import { getDict } from "@/dictionaries/dictionaries";
import LoginForm from "@/components/pages/login/LoginForm";

export default async function page() {
  const locale = getLocaleInServer(headers);
  const dict = await getDict(locale);

  return (
    <section
      className={tw(
        `flex items-center justify-between gap-12 overflow-hidden max-lg:flex-col max-lg:items-stretch max-lg:gap-8`,
        topMarginSaving,
        bottomMarginSaving
      )}
    >
      <Image
        alt="phones"
        src={"/images/sign_up/street-cats-registration.png"}
        width={800}
        height={800}
        className="h-auto w-[1000px] min-w-0 object-contain max-3xl:w-[750px] max-2xl:w-[600px] max-lg:order-2 max-lg:w-full max-lg:max-w-full max-lg:object-contain"
        priority
      />

      <div
        className={tw(
          "text-color-text-3 flex min-w-0 flex-col gap-14 flex-[0_0_25%] max-3xl:flex-[0_0_30%] max-2xl:gap-8 max-lg:order-1 max-lg:w-auto max-lg:flex-none max-lg:gap-8 max-sm:gap-6",
          horizontalMarginLimit,
          "ml-0 max-3xl:ml-0 max-2xl:ml-0 max-lg:mx-8 max-sm:mx-5"
        )}
      >
        <div className="flex flex-col items-start gap-5 max-2xl:gap-2">
          <h1
            className={`${interMediumFont.className} break-words text-[40px] max-2xl:text-3xl max-sm:text-2xl`}
          >
            {dict.pages.registration.login.title}
          </h1>
          <p className="text-lg max-2xl:text-base">
            {dict.pages.registration.login.subtitle}
          </p>
        </div>
        <LoginForm dict={dict} />
      </div>
    </section>
  );
}
