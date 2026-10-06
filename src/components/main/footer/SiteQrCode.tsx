"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function SiteQrCode({ locale }: { locale: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const [url, setUrl] = useState(`https://vasiliy2197463-jpg.github.io/exclusive-store-project-7/${locale}/`);

  useEffect(() => {
    const publicBase = window.location.hostname === "vasiliy2197463-jpg.github.io"
      ? "https://vasiliy2197463-jpg.github.io/exclusive-store-project-7"
      : `${window.location.origin}${basePath}`;
    setUrl(`${publicBase}/${locale}/`);
  }, [basePath, locale]);

  return (
    <div className="rounded-lg bg-white p-2" title={url}>
      <QRCodeCanvas
        value={url}
        size={128}
        level="H"
        marginSize={1}
        imageSettings={{
          src: "/images/about/luchik-kuzya-vitalik-shopping.png",
          width: 28,
          height: 28,
          excavate: true,
        }}
        className="h-28 w-28 max-2xl:h-24 max-2xl:w-24"
      />
    </div>
  );
}
