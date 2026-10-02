import WishListSection from "@/components/pages/wishlist";
import { getDict } from "@/dictionaries/dictionaries";
import {
  bottomMarginSaving,
  horizontalMarginLimit,
  topMarginSaving,
} from "@/shared/constants";
import { TLanguages } from "@/shared/types";
import { twMerge as tw } from "tailwind-merge";

export default async function page({ params }: { params: { lang: TLanguages } }) {
  const locale = params.lang;
  const dict = await getDict(locale);
  return (
    <div
      className={tw(
        "space-y-20",
        topMarginSaving,
        horizontalMarginLimit,
        bottomMarginSaving
      )}
    >
      <WishListSection dict={dict} />
    </div>
  );
}
