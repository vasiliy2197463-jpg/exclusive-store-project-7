"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function sourceFrom(referrer: string, tagged: string | null) {
  if (tagged) return tagged.toLowerCase();
  const value = referrer.toLowerCase();
  if (!value) return "direct";
  if (value.includes("instagram")) return "instagram";
  if (value.includes("t.me") || value.includes("telegram")) return "telegram";
  if (value.includes("vk.com")) return "vk";
  if (value.includes("google")) return "google";
  try { return new URL(referrer).hostname.replace(/^www\./, ""); } catch { return "other"; }
}

export default function SiteAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname.includes("/admin")) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const key = "exclusive-visitor-id";
    let visitorId = localStorage.getItem(key);
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem(key, visitorId);
    }
    const ua = navigator.userAgent;
    const device = /tablet|ipad/i.test(ua) ? "tablet" : /mobile|iphone|android/i.test(ua) ? "mobile" : "desktop";
    const platform = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform || navigator.platform || "unknown";
    const referrer = document.referrer || "";
    void supabase.from("page_views").insert({
      visitor_id: visitorId,
      path: pathname,
      entry_path: sessionStorage.getItem("exclusive-entry-path") || pathname,
      source: sourceFrom(referrer, searchParams.get("utm_source")),
      referrer,
      device,
      platform,
    });
    if (!sessionStorage.getItem("exclusive-entry-path")) sessionStorage.setItem("exclusive-entry-path", pathname);
  }, [pathname, searchParams]);

  return null;
}
