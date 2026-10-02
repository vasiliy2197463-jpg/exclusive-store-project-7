import NavigationTrain from "@/components/navigation_train";
import {
  bottomMarginSaving,
  horizontalMarginLimit,
  topMarginSaving,
} from "@/shared/constants";
import { twMerge as tw } from "tailwind-merge";
import FormSection from "@/components/pages/cart/check_out/FormSection";
import TotalSection from "@/components/pages/cart/check_out/TotalSection";
import { TLanguages } from "@/shared/types";
import { getDict } from "@/dictionaries/dictionaries";

export default async function page({ params }: { params: { lang: TLanguages } }) {
  const locale = params.lang;
  const dict = await getDict(locale);
  return (
    <div
      className={tw(
        "flex items-start justify-between pt-8 max-lg:pt-6 max-sm:pt-5",
        topMarginSaving,
        bottomMarginSaving,
        horizontalMarginLimit
      )}
    >
      <NavigationTrain />
      <FormSection dict={dict} />
      <TotalSection dict={dict} />
    </div>
  );
}
