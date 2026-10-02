import ArrowButton from "@/components/buttons/arrow_button/ArrowButton";
import AloneBannerSection from "@/components/pages/home/AloneBannerSection";
import BannerSideBarSection from "@/components/pages/home/banner_sidebar_section";
import BestSellingSection from "@/components/pages/home/BestSellingSection";
import CategoriesSection from "@/components/pages/home/CategoriesSection";
import NewArrivalSection from "@/components/pages/home/NewArrivalSection";
import ProductsSection from "@/components/pages/home/products_section";
import SalesSection from "@/components/pages/home/SalesSection";
import ServicesSection from "@/components/pages/home/ServicesSection";
import { bottomMarginSaving, horizontalMarginLimit } from "@/shared/constants";
import { twMerge as tw } from "tailwind-merge";
import { TLanguages } from "@/shared/types";
import { getDict } from "@/dictionaries/dictionaries";

export default async function Home({ params }: { params: { lang: TLanguages } }) {
  const dict = await getDict(params.lang);
  return (
    <div
      className={tw(
        `flex flex-col gap-40 max-3xl:gap-32 max-2xl:gap-28 max-lg:gap-20 max-sm:gap-14`,
        bottomMarginSaving,
        horizontalMarginLimit
      )}
    >
      <ArrowButton
        direction="up"
        className="fixed bottom-12 right-20 z-10 max-lg:bottom-6 max-lg:right-6"
        isScrolling
      />
      <BannerSideBarSection locale={params.lang} dict={dict} />
      <SalesSection salesUntil={new Date("12-30-2023")} locale={params.lang} dict={dict} />
      <CategoriesSection dict={dict} />
      <BestSellingSection dict={dict} />
      <AloneBannerSection salesUntil={new Date("12-10-2023")} dict={dict} />
      <ProductsSection dict={dict} />
      <NewArrivalSection locale={params.lang} dict={dict} />
      <ServicesSection dict={dict} />
    </div>
  );
}


