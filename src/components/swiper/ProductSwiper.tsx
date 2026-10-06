"use client";

import { SwiperSlide, Swiper } from "swiper/react";
import { IProductSwiper } from "types";
import ProductCard from "../cards/product_card/ProductCard";
import { twMerge as tw } from "tailwind-merge";
import "swiper/css";
import { Mousewheel } from "swiper/modules";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type CatalogProduct = {
  name: string;
  price: number;
  old_price: number | null;
  active: boolean;
  archived: boolean;
};

const normalize = (value: string) => value.trim().toLocaleLowerCase();

export default function ProductSwiper({
  data,
  swiperProps,
  itemsCentered,
  syncWithCatalog,
}: IProductSwiper) {
  const [products, setProducts] = useState(data);

  useEffect(() => {
    setProducts(data);
    if (!syncWithCatalog) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    let current = true;
    supabase
      .from("products")
      .select("name,price,old_price,active,archived")
      .then(({ data: rows }) => {
        if (!current || !rows?.length) return;
        const catalog = new Map(
          (rows as CatalogProduct[]).map((row) => [normalize(row.name), row])
        );
        setProducts(
          data
            .filter((item) => {
              const row = catalog.get(normalize(item.name));
              return !row || (row.active && !row.archived);
            })
            .map((item) => {
              const row = catalog.get(normalize(item.name));
              if (!row) return item;
              const oldPrice = Number(row.old_price || 0);
              const price = Number(row.price);
              return {
                ...item,
                price: oldPrice || price,
                discount:
                  oldPrice > price
                    ? Math.round((1 - price / oldPrice) * 100)
                    : undefined,
              };
            })
        );
      });
    return () => {
      current = false;
    };
  }, [data, syncWithCatalog]);

  return (
    <Swiper
      {...swiperProps}
      modules={[...((swiperProps.modules as any[]) || []), Mousewheel]}
      mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
      simulateTouch
      grabCursor
      watchOverflow
      className="w-full max-w-full overflow-hidden cursor-grab"
    >
      {products.map((item, i) => (
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
