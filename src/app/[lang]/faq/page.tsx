import { TLanguages } from "@/shared/types";

export default function Faq({ params }: { params: { lang: TLanguages } }) {
  const ru = params.lang === "ru";
  const items = ru ? [["Как оформить заказ?","Добавьте товары в корзину и перейдите к оформлению."],["Как применить промокод?","Введите код в корзине и нажмите кнопку применения."],["Где изменить профиль?","Откройте раздел «Мой аккаунт» и нажмите «Редактировать»." ]] : [["How do I order?","Add items to cart and proceed to checkout."],["How do I use a promo code?","Enter it in the cart and apply it."],["Where can I edit my profile?","Open My Account and choose Edit."]];
  return <main className="mx-auto min-h-[55vh] max-w-4xl px-6 py-16"><h1 className="text-4xl font-bold">{ru ? "Часто задаваемые вопросы" : "Frequently Asked Questions"}</h1><div className="mt-8 space-y-4">{items.map(([q,a])=><section key={q} className="rounded-2xl border p-5"><h2 className="text-xl font-bold">{q}</h2><p className="mt-2">{a}</p></section>)}</div></main>;
}
