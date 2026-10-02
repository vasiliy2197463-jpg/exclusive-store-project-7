import SideBar from "./SideBar";
import Banner from "./Banner";
import MainDivider from "@/components/main/dividers";

export default function BannerSideBarSection() {
  return (
    <section className="flex max-lg:flex-col">
      <div className="max-lg:hidden"><SideBar /></div>
      <div className="max-lg:hidden"><MainDivider dir="vertical" /></div>
      <Banner />
    </section>
  );
}
