import PrimaryButton from "@/components/buttons/PrimaryButton";
import Footer from "@/components/main/footer/Footer";
import MainHeader from "@/components/main/header/MainHeader";
import TopHeader from "@/components/main/header/TopHeader";
import NavigationTrain from "@/components/navigation_train";
import { getDict } from "@/dictionaries/dictionaries";
import { horizontalMarginLimit } from "@/shared/constants";
import { interMediumFont } from "fonts";
import Link from "next/link";
import { twMerge as tw } from "tailwind-merge";

export default async function NotFound() {
  const locale = "en" as const;
  const dict = await getDict(locale);
  return (
    <>
      <header>
        <TopHeader locale={locale} dict={dict} />
        <MainHeader locale={locale} dict={dict} />
      </header>
      <main className="flex-grow bg-color-bg text-color-text-3 relative">
        <div
          className={tw(
            "mb-28 pt-8 max-lg:pt-6 max-sm:pt-5",
            horizontalMarginLimit
          )}
        >
          <NavigationTrain isNotFound />
          <div className="flex min-h-[40dvh] flex-col items-center justify-center gap-20">
          <div className="flex flex-col text-center gap-10">
            <h1
              className={`${interMediumFont.className} text-9xl capitalize max-2xl:text-7xl`}
            >
              {dict.pages.notFound.title}
            </h1>
            <h5 className="text-lg">{dict.pages.notFound.description}</h5>
          </div>
          <Link href={`/${locale}`}>
            <PrimaryButton>{dict.pages.notFound.button}</PrimaryButton>
          </Link>
          </div>
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
