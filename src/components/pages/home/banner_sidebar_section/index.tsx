import SideBar from "./SideBar";
import Banner from "./Banner";
import MainDivider from "@/components/main/dividers";
import { TLanguages } from "@/shared/types";

export default function BannerSideBarSection({ locale, dict }: { locale: TLanguages; dict: any }) {
  return (
    <section className="flex max-lg:flex-col">
      <div className="max-lg:hidden"><SideBar locale={locale} dict={dict} /></div>
      <div className="max-lg:hidden"><MainDivider dir="vertical" /></div>
      <Banner />
    </section>
  );
}
