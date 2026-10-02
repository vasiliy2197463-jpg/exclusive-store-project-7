import PrimaryButton from "@/components/buttons/PrimaryButton";
import ProductSwiper from "@/components/swiper/ProductSwiper";
import SectionDescription from "@/components/titles/SectionDescription";
import SectionTitle from "@/components/titles/SectionTitle";
import { homeBestSellingSwiper } from "@/data";

export default function BestSellingSection({ dict }: { dict: any }) {
  return (
    <section className="flex flex-col gap-20 max-2xl:gap-10">
      <div className="flex flex-col gap-7">
        <SectionTitle text={dict.pages.index.bestSelling.title} />
        <div className="flex items-center justify-between max-sm:items-end max-sm:gap-4">
          <SectionDescription text={dict.pages.index.bestSelling.description} />
          <PrimaryButton>{dict.pages.index.bestSelling.viewAll}</PrimaryButton>
        </div>
      </div>
      <div>
        <ProductSwiper
          swiperProps={{
            slidesPerView: 5,
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
                slidesPerView: 4,
              },
              1536: {
                slidesPerView: 4,
              },
              1620: {
                slidesPerView: 5,
              },
            },
          }}
          data={homeBestSellingSwiper}
        />
      </div>
    </section>
  );
}
