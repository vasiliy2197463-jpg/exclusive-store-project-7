import { TLanguages } from "@/shared/types";

export default function Privacy({ params }: { params: { lang: TLanguages } }) {
  const ru = params.lang === "ru";
  return <main className="mx-auto min-h-[55vh] max-w-4xl px-6 py-16"><h1 className="text-4xl font-bold">{ru ? "Политика конфиденциальности" : "Privacy Policy"}</h1><p className="mt-6 text-lg leading-8">{ru ? "Учебный интернет-магазин хранит только данные, необходимые для регистрации, оформления заказа и работы личного кабинета. Данные не продаются третьим лицам." : "This educational store only stores data required for registration, orders and account features. Personal data is not sold to third parties."}</p></main>;
}
