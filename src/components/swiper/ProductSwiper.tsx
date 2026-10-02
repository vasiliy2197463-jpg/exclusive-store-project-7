"use client";

import { SwiperSlide, Swiper } from "swiper/react";
import { IProductSwiper } from "types";
import ProductCard from "../cards/product_card/ProductCard";
import { twMerge as tw } from "tailwind-merge";
import "swiper/css";
import { Mousewheel } from "swiper/modules";

export default function ProductSwiper({
  data,
  swiperProps,
  itemsCentered,
}: IProductSwiper) {
  return (
    <Swiper
      {...swiperProps}
      modules={[...((swiperProps.modules as any[]) || []), Mousewheel]}
      mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
      simulateTouch
      grabCursor
      watchOverflow
      className="w-full cursor-grab"
    >
      {data.map((item, i) => (
        <SwiperSlide key={i}>
          <div
            className={tw(
              "flex w-full min-w-0 items-center p-1",
              itemsCentered && "justify-center"
            )}
          >
            <ProductCard {...item} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
