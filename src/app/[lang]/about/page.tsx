import NavigationTrain from "@/components/navigation_train";
import {
  bottomMarginSaving,
  horizontalMarginLimit,
} from "@/shared/constants";
import { twMerge as tw } from "tailwind-merge";
import { interSemiboldFont } from "fonts";
import Image from "next/image";
import AboutCard from "@/components/cards/about_card";
import AboutEmployeesSwiper from "@/components/pages/about/AboutEmployeesSwiper";
import ServiceCard from "@/components/cards/service_card";
import { TLanguages } from "@/shared/types";
import { getDict } from "@/dictionaries/dictionaries";

export default async function page({ params }: { params: { lang: TLanguages } }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const locale = params.lang;
  const dict = await getDict(locale);
  return (
    <div
      className={tw(
        `pt-8 text-color-text-3 max-lg:pt-6 max-sm:pt-5`,
        bottomMarginSaving,
        horizontalMarginLimit
      )}
    >
      <NavigationTrain />
      <div className="flex flex-col gap-56 max-3xl:gap-48 max-2xl:gap-32 max-lg:gap-20 max-sm:gap-14">
      {/* our story texts */}
      <section className="flex items-center justify-between gap-5 max-lg:flex-col max-lg:items-stretch">
        <div className="flex flex-col flex-[0_1_40%] gap-12 max-3xl:gap-8 max-3xl:flex-[0_1_45%] max-lg:order-2">
          <h1
            className={tw(
              "text-6xl capitalize max-2xl:text-4xl max-sm:text-3xl",
              interSemiboldFont.className
            )}
          >
            {dict.pages.aboutUs.section1.title}
          </h1>
          <p className="text-lg max-2xl:text-base">
            {dict.pages.aboutUs.section1.text1}
          </p>
          <p className="text-lg max-2xl:text-base">
            {dict.pages.aboutUs.section1.text2}
          </p>
        </div>
        <Image
          alt="girls"
          src={`${basePath}/images/about/luchik-kuzya-vitalik-shopping.png`}
          width={700}
          height={700}
          className="w-[900px] object-contain
          max-3xl:w-[600px] max-2xl:w-[500px] max-lg:w-full max-lg:max-h-[520px]"
          priority
        />
      </section>
      {/* about cards */}
      <section className="grid grid-cols-4 gap-6 max-xl:grid-cols-2 max-sm:grid-cols-1">
        {dict.pages.aboutUs.section2.aboutCards.map((item, i) => (
          <AboutCard key={i} {...item} i={i} />
        ))}
      </section>
      {/* swiper employees */}
      <section>
        <AboutEmployeesSwiper dict={dict} />
      </section>
      {/* service cards */}
      <section className="flex items-center justify-evenly gap-10 max-lg:flex-wrap max-sm:flex-col">
        {dict.pages.aboutUs.section4.services.map((item, i) => (
          <ServiceCard key={i} {...item} />
        ))}
      </section>
      </div>
    </div>
  );
}
