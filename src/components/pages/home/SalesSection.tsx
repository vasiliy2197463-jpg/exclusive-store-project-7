import PrimaryButton from "@/components/buttons/PrimaryButton";
import PrimaryTimeCalc from "@/components/time_calculating/PrimaryTimeCalc";
import SectionDescription from "@/components/titles/SectionDescription";
import SectionTitle from "@/components/titles/SectionTitle";
import Link from "next/link";
import ProductSwiper from "@/components/swiper/ProductSwiper";
import { homeSalesSwiper } from "@/data";
import ArrowButton from "@/components/buttons/arrow_button/ArrowButton";
import { TLanguages } from "@/shared/types";

export default async function SalesSection({
  salesUntil,
  locale,
  dict,
}: {
  salesUntil: Date;
  locale: TLanguages;
  dict: any;
}) {
  return (
    <section className="flex flex-col gap-7 border-b border-color-divider pb-14 max-2xl:pb-10">
      <SectionTitle text={dict.pages.index.sales.title} />
      <div className="flex items-center justify-between max-lg:items-end max-sm:gap-4">
        <div className="flex items-center gap-20 max-lg:flex-col max-lg:items-start max-lg:gap-5">
          <SectionDescription text={dict.pages.index.sales.description} />
          <PrimaryTimeCalc date={salesUntil} dict={dict} />
        </div>
        <div className="flex items-center gap-2">
          <ArrowButton direction="left" />
          <ArrowButton direction="right" />
        </div>
      </div>
      <div>
        <ProductSwiper
          data={homeSalesSwiper}
          swiperProps={{
            slidesPerView: 5.5,
            spaceBetween: 24,
            breakpoints: {
              1: {
                slidesPerView: 1.25,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 2.25,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3.25,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 3.5,
              },
              1536: {
                slidesPerView: 4.5,
              },
              1620: {
                slidesPerView: 5.5,
              },
            },
          }}
        />
      </div>
      <div className="flex items-center justify-center mt-16 max-2xl:mt-8">
        <Link href={`/${locale}/products/sales`} prefetch={false}>
          <PrimaryButton>{dict.pages.index.sales.viewAll}</PrimaryButton>
        </Link>
      </div>
    </section>
  );
}
