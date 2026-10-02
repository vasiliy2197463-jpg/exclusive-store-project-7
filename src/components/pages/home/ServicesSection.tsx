import ServiceCard from "@/components/cards/service_card";

export default function ServicesSection({ dict }: { dict: any }) {
  return (
    <section className="flex items-center justify-evenly gap-10 max-lg:flex-wrap max-sm:flex-col">
      {dict.pages.index.services.map((item: any, i: number) => (
        <ServiceCard key={i} {...item} />
      ))}
    </section>
  );
}
