"use client";

import { useEffect } from "react";

export default function RootPage() {
  useEffect(() => {
    window.location.replace(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/ru/`);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center p-6 text-center">
      <a className="text-xl underline" href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/ru/`}>
        Открыть Exclusive Store
      </a>
    </main>
  );
}
