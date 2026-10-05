import BannerContent from "@/components/titles/BannerContent";
import SectionDescription from "@/components/titles/SectionDescription";
import SectionTitle from "@/components/titles/SectionTitle";
import { TLanguages } from "@/shared/types";
import Image from "next/image";

export default function NewArrivalSection({ locale, dict }: { locale: TLanguages; dict: any }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return (
    <section className="felx flex-col space-y-10 max-2xl:space-y-8">
      <div className="space-y-7">
        <SectionTitle text={dict.pages.index.newArrival.title} />
        <SectionDescription text={dict.pages.index.newArrival.description} />
      </div>
      <div className="grid grid-cols-4 grid-rows-2 h-[600px] gap-10 max-2xl:h-[500px] max-lg:grid-cols-2 max-lg:grid-rows-none max-lg:h-auto max-lg:gap-5 max-sm:grid-cols-1">
        <div
          style={{ backgroundImage: `url(${basePath}/images/home/ps5.webp)` }}
          className="col-span-2 row-span-2 bg-color-bg-1 bg-no-repeat bg-contain bg-bottom flex min-h-[480px] items-end p-10 rounded-sm max-sm:col-span-1 max-sm:min-h-[420px] max-sm:p-6"
        >
          <BannerContent
            locale={locale}
            description={dict.pages.index.newArrival.ps5.description}
            title={dict.pages.index.newArrival.ps5.title}
          />
        </div>
        <div
          style={{ backgroundImage: `url(${basePath}/images/home/alice-fashion.png)` }}
          className="col-span-2 min-h-[260px] flex items-end p-10 rounded-sm bg-color-bg-1 bg-no-repeat bg-contain bg-right max-sm:col-span-1 max-sm:p-6
        shadow-[inset_-100px_0_100px_10px_rgba(255,255,255,0.2)]"
        >
          <BannerContent
            locale={locale}
            description={dict.pages.index.newArrival.women.description}
            title={dict.pages.index.newArrival.women.title}
          />
        </div>
        <div className="flex min-h-[260px] items-end p-10 rounded-sm bg-color-bg-1 relative max-sm:p-6">
          <Image
            alt="banner"
            src={"/images/home/speakers.webp"}
            width={300}
            height={300}
            className="h-52 object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] max-2xl:h-40"
          />
          <BannerContent
            locale={locale}
            description={dict.pages.index.newArrival.speakers.description}
            title={dict.pages.index.newArrival.speakers.title}
            className="absolute bottom-0 left-0 p-10"
          />
        </div>
        <div className="flex min-h-[260px] items-end p-10 bg-color-bg-1 rounded-sm relative max-sm:p-6">
          <Image
            alt="banner"
            src={"/images/home/perfume.webp"}
            width={300}
            height={300}
            className="h-52 object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] max-2xl:h-40"
          />
          <BannerContent
            locale={locale}
            description={dict.pages.index.newArrival.perfume.description}
            title={dict.pages.index.newArrival.perfume.title}
            className="absolute bottom-0 left-0 p-10"
          />
        </div>
      </div>
    </section>
  );
}
