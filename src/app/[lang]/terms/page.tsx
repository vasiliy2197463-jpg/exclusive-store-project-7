import { TLanguages } from "@/shared/types";

export default function Terms({ params }: { params: { lang: TLanguages } }) {
  const ru = params.lang === "ru";
  return <main className="mx-auto min-h-[55vh] max-w-4xl px-6 py-16"><h1 className="text-4xl font-bold">{ru ? "Условия использования" : "Terms of Use"}</h1><p className="mt-6 text-lg leading-8">{ru ? "Это демонстрационный учебный магазин. Каталог, цены, промокоды и оформление заказов используются для проверки функций проекта." : "This is an educational demonstration store. Its catalog, prices, promo codes and checkout are provided to test the project features."}</p></main>;
}
