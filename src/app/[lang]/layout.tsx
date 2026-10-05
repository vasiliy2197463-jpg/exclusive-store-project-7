import Footer from "@/components/main/footer/Footer";
import MainHeader from "@/components/main/header/MainHeader";
import TopHeader from "@/components/main/header/TopHeader";
import { IChildren } from "@/shared/types";
import { TLanguages } from "@/shared/types";
import { getDict } from "@/dictionaries/dictionaries";
import SiteAnalytics from "@/components/analytics/SiteAnalytics";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ru" }, { lang: "tm" }];
}

export default async function layout({ children, params }: IChildren & { params: { lang: TLanguages } }) {
  const dict = await getDict(params.lang);
  return (
    <>
      <SiteAnalytics />
      <header>
        <TopHeader locale={params.lang} dict={dict} />
        <MainHeader locale={params.lang} dict={dict} />
      </header>
      <main className="flex-grow bg-color-bg text-color-text-3 relative">
        {children}
      </main>
      <Footer locale={params.lang} dict={dict} />
    </>
  );
}
