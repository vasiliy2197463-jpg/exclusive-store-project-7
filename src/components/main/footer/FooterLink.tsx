"use client";
import { IFooterLink } from "types";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FooterLink({ href, text, isIndependent }: IFooterLink) {
  const pathname = usePathname();
  const locale = pathname.split("/").find((part) => ["en", "ru", "tm"].includes(part)) || "ru";
  const normalized = href.replace(/^\/+/, "");
  const external = /^(https?:|mailto:|malito:|tel:)/i.test(href);
  const target = isIndependent || external
    ? href.replace(/^malito:/i, "mailto:")
    : normalized === "#"
      ? `/${locale}`
      : `/${locale}/${normalized}`;

  return (
    <Link
      href={target}
      prefetch={false}
      className="hover:text-color-text-2 transition-colors duration-300 ease-in-out text-base max-2xl:text-sm"
    >
      {text}
    </Link>
  );
}
