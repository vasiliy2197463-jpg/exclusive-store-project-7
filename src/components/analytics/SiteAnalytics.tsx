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
    const taggedSource = searchParams.get("utm_source");
    const taggedRef = searchParams.get("ref") || searchParams.get("ref_code");
    if (taggedSource) sessionStorage.setItem("exclusive-source", taggedSource);
    if (taggedRef) sessionStorage.setItem("exclusive-ref-code", taggedRef);
    const payload = {
      visitor_id: visitorId,
      path: pathname,
      entry_path: sessionStorage.getItem("exclusive-entry-path") || pathname,
      source: sourceFrom(referrer, taggedSource || sessionStorage.getItem("exclusive-source")),
      ref_code: taggedRef || sessionStorage.getItem("exclusive-ref-code") || "",
      referrer,
      device,
      platform,
    };
    void (async () => {
      const { error } = await supabase.from("page_views").insert(payload);
      if (error) {
        console.error("Analytics page view was not recorded:", error.message);
        localStorage.setItem("exclusive-analytics-error", error.message);
        return;
      }
      localStorage.removeItem("exclusive-analytics-error");
    })();
    if (!sessionStorage.getItem("exclusive-entry-path")) sessionStorage.setItem("exclusive-entry-path", pathname);
  }, [pathname, searchParams]);

  return null;
}
