import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryTimeCalc from "@/components/time_calculating/SecondaryTimeCalc";
import SectionDescription from "@/components/titles/SectionDescription";
import SectionTitle from "@/components/titles/SectionTitle";
import Image from "next/image";

export default async function AloneBannerSection({
  salesUntil,
  dict,
}: {
  salesUntil: Date;
  dict: any;
}) {
  return (
    <section className="bg-color-bg-1 flex px-16 py-20 max-lg:flex-col max-lg:px-10 max-lg:py-12 max-sm:px-6 max-sm:py-8">
      <div className="flex flex-col items-start justify-between gap-8 flex-1">
        <SectionTitle
          withoutQuadrant
          text={dict.pages.index.banner.title}
          className="text-color-text-4"
        />
        <SectionDescription
          text={dict.pages.index.banner.description}
          className="text-color-text-1 text-6xl leading-[70px] max-w-xl max-3xl:text-5xl max-3xl:leading-[60px] max-2xl:max-w-md max-lg:text-4xl max-lg:leading-tight max-sm:text-3xl"
        />
        <SecondaryTimeCalc date={salesUntil} dict={dict} />
        <PrimaryButton className="bg-color-button hover:bg-color-button-hover">
          {dict.pages.index.banner.buy}
        </PrimaryButton>
      </div>
      <Image
        alt="banner-image"
        src={"/images/home/banner-1.webp"}
        width={700}
        height={700}
        className="object-contain drop-shadow-[0_0_100px_rgba(255,255,255,0.5)] w-auto h-auto
        max-3xl:w-[500px] max-3xl:drop-shadow-[0_0_60px_rgba(255,255,255,0.5)]
        max-2xl:w-[450px] max-2xl:drop-shadow-[0_0_50px_rgba(255,255,255,0.5)] max-lg:mt-8 max-lg:w-full max-lg:max-w-lg max-lg:self-center"
      />
    </section>
  );
}
