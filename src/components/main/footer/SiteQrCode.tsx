"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function SiteQrCode() {
  const [url, setUrl] = useState("https://example.com");

  useEffect(() => setUrl(window.location.origin), []);

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
