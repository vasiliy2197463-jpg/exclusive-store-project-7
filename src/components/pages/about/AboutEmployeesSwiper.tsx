"use client";

import AboutEmployeeCard from "@/components/cards/about_employee_card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { IAboutEmployeeCard } from "@/shared/types";

export default function AboutEmployeesSwiper({ dict }: { dict: any }) {
  return (
    <Swiper
      slidesPerView={3}
      spaceBetween={24}
      breakpoints={{
        1: { slidesPerView: 1, spaceBetween: 20 },
        640: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 24 },
      }}
      loop
      modules={[Pagination, Navigation]}
      navigation
      grabCursor
      pagination={{
        clickable: true,
      }}
      className="about-employees-swiper"
    >
      {dict.pages.aboutUs.section3.employeeCards.slice(0, 3).map(
        (item: IAboutEmployeeCard, i: number) => {
          return (
            <SwiperSlide key={i}>
              <AboutEmployeeCard {...item} />
            </SwiperSlide>
          );
        }
      )}
    </Swiper>
  );
}
