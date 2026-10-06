import NavigationTrain from "@/components/navigation_train";
import CartProductsSection from "@/components/pages/cart/CartProductsSection";
import CartTotalSection from "@/components/pages/cart/CartTotalSection";
import { getDict } from "@/dictionaries/dictionaries";
import {
  bottomMarginSaving,
  horizontalMarginLimit,
} from "@/shared/constants";
import { TLanguages } from "@/shared/types";
import { twMerge as tw } from "tailwind-merge";

export default async function page({ params }: { params: { lang: TLanguages } }) {
  const locale = params.lang;
  const dict = await getDict(locale);
  return (
    <div
      className={tw(
        "pt-8 max-lg:pt-6 max-sm:pt-5",
        bottomMarginSaving,
        horizontalMarginLimit
      )}
    >
      <NavigationTrain />
      <div className="space-y-24 max-3xl:space-y-16">
        <CartProductsSection dict={dict} lang={locale} />
        <CartTotalSection dict={dict} lang={locale} />
      </div>
    </div>
  );
}
