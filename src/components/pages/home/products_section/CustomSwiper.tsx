"use client";

import ProductSwiper from "@/components/swiper/ProductSwiper";
import { homeProductsSwiper } from "@/data";
import { Grid } from "swiper/modules";
import "swiper/css/grid";

export default function CustomSwiper() {
  return (
    <ProductSwiper
      swiperProps={{
        slidesPerView: 5,
        spaceBetween: 20,
        modules: [Grid],
        grid: { rows: 2, fill: "row" },
        breakpoints: {
          1: {
            slidesPerView: 1.25,
            spaceBetween: 12,
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 14,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
          1280: {
            slidesPerView: 4,
          },
          1536: {
            slidesPerView: 5,
          },
        },
      }}
      data={homeProductsSwiper}
      syncWithCatalog
    />
  );
}
