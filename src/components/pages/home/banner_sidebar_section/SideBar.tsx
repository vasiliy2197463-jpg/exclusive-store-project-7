import Link from "next/link";
import MenuLink from "./MenuLink";
import { TLanguages } from "@/shared/types";

export default function SideBar({ locale, dict }: { locale: TLanguages; dict: any }) {

  return (
    <aside className="text-color-text-3 text-lg z-10 flex flex-col items-start gap-4 mt-10 pr-4">
      {/* links with menu */}
      {dict.pages.index.sideMenu.otherMenu.map((item: any, i: number) => (
        <MenuLink key={i} {...item} />
      ))}

      {/* usual links */}
      {dict.pages.index.sideMenu.plainMenu.map((item: any, i: number) => (
        <Link
          href={`/${locale}/${item.href}`}
          className="capitalize"
          key={i}
          prefetch={false}
        >
          {item.name}
        </Link>
      ))}
    </aside>
  );
}
