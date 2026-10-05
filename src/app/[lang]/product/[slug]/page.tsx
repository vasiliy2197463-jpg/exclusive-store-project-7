import { notFound } from "next/navigation";
import ProductDetails from "@/components/pages/product/ProductDetails";
import { homeBestSellingSwiper, homeProductsSwiper, homeSalesSwiper } from "@/data";
import { TLanguages } from "@/shared/types";

const products = [...homeSalesSwiper, ...homeBestSellingSwiper, ...homeProductsSwiper];
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9а-яё]+/gi, "-").replace(/^-|-$/g, "");
const uniqueProducts = Array.from(new Map(products.map((product) => [slugify(product.name), product])).entries());

export const dynamicParams = false;

export function generateStaticParams() {
  return uniqueProducts.map(([slug]) => ({ slug }));
}

export default function ProductPage({ params }: { params: { lang: TLanguages; slug: string } }) {
  const product = uniqueProducts.find(([slug]) => slug === params.slug)?.[1];
  if (!product) notFound();
  return <ProductDetails product={product} locale={params.lang} />;
}
