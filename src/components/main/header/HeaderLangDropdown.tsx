"use client";

import { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import { ILangPropsToComponent, TLanguages } from "types";

const languages: { value: TLanguages; label: string }[] = [
  { value: "en", label: "English" },
  { value: "ru", label: "Russian" },
  { value: "tm", label: "Turkmen" },
];

export default function HeaderLangDropdown({ lang }: ILangPropsToComponent) {
  const [language, setLanguage] = useState<TLanguages>(lang);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => setLanguage(lang), [lang]);

  function choose(next: TLanguages) {
    setLanguage(next);
    setOpen(false);
    const rest = pathname.split("/").slice(2).filter(Boolean).join("/");
    router.push(`/${next}${rest ? `/${rest}` : ""}`);
  }

  const selected = languages.find((item) => item.value === language) ?? languages[0];

  return (
    <div className="relative min-w-[132px] max-sm:min-w-[108px]">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 rounded-lg bg-black px-3 py-2 text-left text-base text-white hover:bg-neutral-900 max-sm:text-xs"
      >
        <span>{selected.label}</span>
        <FiChevronDown className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div role="listbox" className="absolute right-0 top-full z-[300] mt-1 w-40 overflow-hidden rounded-lg border border-white/20 bg-black p-1 shadow-2xl max-sm:fixed max-sm:left-4 max-sm:right-4 max-sm:top-16 max-sm:w-auto">
          {languages.map((item) => (
            <button
              key={item.value}
              type="button"
              role="option"
              aria-selected={item.value === language}
              onClick={() => choose(item.value)}
              className={`block w-full rounded-md px-3 py-2.5 text-left text-sm transition-colors ${item.value === language ? "bg-white text-black" : "bg-black text-white hover:bg-neutral-800"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
