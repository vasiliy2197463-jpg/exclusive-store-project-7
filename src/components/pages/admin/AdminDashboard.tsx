"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  homeSalesSwiper,
  homeBestSellingSwiper,
  homeProductsSwiper,
} from "@/data";
import { AiOutlineInstagram } from "react-icons/ai";
import { FaTelegramPlane, FaVk } from "react-icons/fa";

type Tab =
  | "overview"
  | "analytics"
  | "products"
  | "stock"
  | "trash"
  | "promos"
  | "orders"
  | "customers"
  | "reviews"
  | "support";
type Product = {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  old_price: number | null;
  stock: number;
  active: boolean;
  archived?: boolean;
  description: string;
};
type ProductForm = {
  name: string;
  slug: string;
  category: string;
  price: string;
  old_price: string;
  stock: string;
  description: string;
};
type Promo = {
  id?: number;
  code: string;
  discount_percent: number;
  active: boolean;
};
type Order = {
  id: string;
  status: string;
  total: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  created_at: string;
};
type Customer = {
  id: string;
  full_name: string;
  phone: string;
  role: string;
  created_at: string;
};
type Thread = { id: string; status: string; last_message_at: string };
type Review = {
  id: number;
  product_slug: string;
  product_name: string;
  author_name: string;
  rating: number;
  body: string;
  status: "pending" | "published" | "rejected";
  admin_reply: string;
  created_at: string;
};
type PageView = {
  id: number;
  visitor_id: string;
  path: string;
  entry_path: string;
  source: string;
  ref_code: string;
  referrer: string;
  device: string;
  platform: string;
  created_at: string;
};
type VisitorPeriod = "today" | "yesterday" | "earlier" | "mine";

const blank: ProductForm = {
  name: "",
  slug: "",
  category: "",
  price: "",
  old_price: "",
  stock: "0",
  description: "",
};
const statuses = [
  "new",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-|-$/g, "");
const toForm = (p: Product): ProductForm => ({
  name: p.name,
  slug: p.slug,
  category: p.category || "",
  price: String(p.price),
  old_price: p.old_price == null ? "" : String(p.old_price),
  stock: String(p.stock),
  description: p.description || "",
});
const productImageMap = new Map(
  [...homeSalesSwiper, ...homeBestSellingSwiper, ...homeProductsSwiper].map(
    (p) => [p.name.trim().toLowerCase(), p.images[0]],
  ),
);

export default function AdminDashboard() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const locale = usePathname().split("/")[1] || "ru";
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true),
    [allowed, setAllowed] = useState(false),
    [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(""),
    [notice, setNotice] = useState(""),
    [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]),
    [promos, setPromos] = useState<Promo[]>([]),
    [orders, setOrders] = useState<Order[]>([]),
    [customers, setCustomers] = useState<Customer[]>([]),
    [threads, setThreads] = useState<Thread[]>([]),
    [reviews, setReviews] = useState<Review[]>([]),
    [views, setViews] = useState<PageView[]>([]);
  const [form, setForm] = useState<ProductForm>(blank),
    [editing, setEditing] = useState<Product | null>(null),
    [editForm, setEditForm] = useState<ProductForm>(blank);
  const [stockDraft, setStockDraft] = useState<Record<number, number>>({}),
    [promoDraft, setPromoDraft] = useState<Record<string, boolean>>({});
  const [refCode, setRefCode] = useState("partner-01");
  const [reviewDraft, setReviewDraft] = useState<Record<number, { status: Review["status"]; admin_reply: string }>>({});
  const [visitorPeriod, setVisitorPeriod] =
    useState<VisitorPeriod>("today");
  const [visitorDevice, setVisitorDevice] = useState("all");
  const [expandedVisitorId, setExpandedVisitorId] = useState("");
  const [ownerVisitorId, setOwnerVisitorId] = useState("");
  const [analyticsNow, setAnalyticsNow] = useState(() => Date.now());

  const load = useCallback(async () => {
    if (!supabase) return;
    const [p, pc, o, c, t, r, v] = await Promise.all([
      supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("promo_codes").select("*").order("discount_percent"),
      supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("id,full_name,phone,role,created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("support_threads")
        .select("id,status,last_message_at")
        .order("last_message_at", { ascending: false }),
      supabase
        .from("product_reviews")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("page_views")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(2000),
    ]);
    setProducts((p.data || []) as Product[]);
    setPromos((pc.data || []) as Promo[]);
    setOrders((o.data || []) as Order[]);
    setCustomers((c.data || []) as Customer[]);
    setThreads((t.data || []) as Thread[]);
    setReviews((r.data || []) as Review[]);
    setViews((v.data || []) as PageView[]);
    const error = p.error || pc.error || o.error || c.error || t.error;
    if (error) setNotice(error.message);
    if (r.error && !String(r.error.message).includes("product_reviews")) setNotice(r.error.message);
    if (v.error) setNotice(`Аналитика: ${v.error.message}`);
  }, [supabase]);

  useEffect(() => {
    (async () => {
      if (!supabase) {
        setMessage("Supabase не подключён");
        setLoading(false);
        return;
      }
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setMessage("Сначала войдите в аккаунт");
        setLoading(false);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();
      if (!profile || !["support", "manager", "admin"].includes(profile.role)) {
        setMessage("Нет доступа к админ-панели");
        setLoading(false);
        return;
      }
      setAllowed(true);
      await load();
      setLoading(false);
    })();
  }, [load, supabase]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    setOwnerVisitorId(
      window.localStorage.getItem("exclusive-visitor-id") || "",
    );
    const timer = window.setInterval(
      () => setAnalyticsNow(Date.now()),
      60_000,
    );
    return () => window.clearInterval(timer);
  }, []);

  const visible = products.filter(
    (p) => !p.archived && p.name.toLowerCase().includes(query.toLowerCase()),
  );
  const trash = products.filter((p) => p.archived),
    inventory = products
      .filter((p) => !p.archived)
      .sort((a, b) => Number(a.stock) - Number(b.stock));
  const stats = useMemo(
    () => {
      const liveProducts = products.filter((p) => !p.archived);
      const paidOrders = orders.filter(
        (o) => !["cancelled", "refunded"].includes(o.status),
      );
      const deliveredOrders = orders.filter((o) => o.status === "delivered");
      const revenue = paidOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
      return {
        products: liveProducts.length,
        stock: liveProducts.reduce((s, p) => s + Number(p.stock || 0), 0),
        stockValue: liveProducts.reduce(
          (s, p) => s + Number(p.stock || 0) * Number(p.price || 0),
          0,
        ),
        orders: orders.length,
        newOrders: orders.filter((o) => o.status === "new").length,
        processingOrders: orders.filter((o) =>
          ["confirmed", "processing", "shipped"].includes(o.status),
        ).length,
        deliveredOrders: deliveredOrders.length,
        cancelledOrders: orders.filter((o) =>
          ["cancelled", "refunded"].includes(o.status),
        ).length,
        revenue,
        completedRevenue: deliveredOrders.reduce(
          (sum, o) => sum + Number(o.total || 0),
          0,
        ),
        averageOrder: paidOrders.length ? revenue / paidOrders.length : 0,
        customers: customers.filter((c) => c.role === "customer").length,
        support: threads.filter((t) => t.status !== "closed").length,
      };
    },
    [products, orders, customers, threads],
  );
  const analytics = useMemo(() => {
    const count = (key: keyof PageView) =>
      Object.entries(
        views.reduce(
          (a, v) => {
            const k = String(v[key] || "unknown");
            a[k] = (a[k] || 0) + 1;
            return a;
          },
          {} as Record<string, number>,
        ),
      ).sort((a, b) => b[1] - a[1]);
    const latest = new Map<string, PageView>();
    views.forEach((v) => {
      if (!latest.has(v.visitor_id)) latest.set(v.visitor_id, v);
    });
    const exitCounts = Array.from(latest.values()).reduce(
      (a, v) => {
        a[v.path] = (a[v.path] || 0) + 1;
        return a;
      },
      {} as Record<string, number>,
    );
    return {
      unique: new Set(views.map((v) => v.visitor_id)).size,
      sources: count("source"),
      refs: count("ref_code").filter(([name]) => name !== "unknown"),
      entries: count("entry_path"),
      exits: Object.entries(exitCounts).sort((a, b) => b[1] - a[1]),
      devices: count("device"),
      platforms: count("platform"),
      pages: count("path"),
    };
  }, [views]);
  const visitorAnalytics = useMemo(() => {
    const today = new Date(analyticsNow);
    today.setHours(0, 0, 0, 0);
    const todayAt = today.getTime();
    const yesterdayAt = todayAt - 86_400_000;
    const isMine = (v: PageView) =>
      Boolean(ownerVisitorId && v.visitor_id === ownerVisitorId);
    const publicViews = views.filter((v) => !isMine(v));
    const todayViews = publicViews.filter(
      (v) => new Date(v.created_at).getTime() >= todayAt,
    );
    const yesterdayViews = publicViews.filter((v) => {
      const created = new Date(v.created_at).getTime();
      return created >= yesterdayAt && created < todayAt;
    });
    const earlierViews = publicViews.filter(
      (v) => new Date(v.created_at).getTime() < yesterdayAt,
    );
    const mineViews = views.filter(isMine);
    const periodViews =
      visitorPeriod === "today"
        ? todayViews
        : visitorPeriod === "yesterday"
          ? yesterdayViews
          : visitorPeriod === "earlier"
            ? earlierViews
            : mineViews;
    const filteredViews = periodViews.filter((v) => {
      if (visitorDevice === "all") return true;
      if (visitorDevice === "phone")
        return ["mobile", "phone", "tablet"].includes(
          String(v.device).toLowerCase(),
        );
      return String(v.device).toLowerCase() === visitorDevice;
    });
    const groups = Array.from(
      filteredViews.reduce((map, view) => {
        const current = map.get(view.visitor_id) || [];
        current.push(view);
        map.set(view.visitor_id, current);
        return map;
      }, new Map<string, PageView[]>()),
    )
      .map(([visitorId, visitorViews]) => ({
        visitorId,
        visits: visitorViews.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime(),
        ),
      }))
      .sort(
        (a, b) =>
          new Date(b.visits[0].created_at).getTime() -
          new Date(a.visits[0].created_at).getTime(),
      );
    const lastByVisitor = new Map<string, number>();
    publicViews.forEach((v) => {
      const created = new Date(v.created_at).getTime();
      lastByVisitor.set(
        v.visitor_id,
        Math.max(lastByVisitor.get(v.visitor_id) || 0, created),
      );
    });
    return {
      online: Array.from(lastByVisitor.values()).filter(
        (created) => analyticsNow - created < 5 * 60_000,
      ).length,
      uniqueToday: new Set(todayViews.map((v) => v.visitor_id)).size,
      todayViews,
      yesterdayViews,
      earlierViews,
      mineViews,
      groups,
    };
  }, [analyticsNow, ownerVisitorId, views, visitorDevice, visitorPeriod]);
  const payload = (v: ProductForm) => ({
    name: v.name.trim(),
    slug: slugify(v.slug || v.name),
    category: v.category.trim(),
    description: v.description.trim(),
    price: Number(v.price),
    old_price: v.old_price ? Number(v.old_price) : null,
    stock: Math.max(0, Number(v.stock)),
  });
  async function addProduct(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    const { error } = await supabase
      .from("products")
      .insert({ ...payload(form), active: true, archived: false });
    if (error) setNotice(error.message);
    else {
      setForm(blank);
      setNotice("Товар добавлен");
      await load();
    }
    setSaving(false);
  }
  async function saveProduct(e: FormEvent) {
    e.preventDefault();
    if (!supabase || !editing) return;
    setSaving(true);
    const { error } = await supabase
      .from("products")
      .update(payload(editForm))
      .eq("id", editing.id);
    if (error) setNotice(error.message);
    else {
      setEditing(null);
      setNotice("Изменения сохранены");
      await load();
    }
    setSaving(false);
  }
  async function updateProduct(
    p: Product,
    values: Partial<Product>,
    ok: string,
  ) {
    if (!supabase) return;
    const { error } = await supabase
      .from("products")
      .update(values)
      .eq("id", p.id);
    if (error) setNotice(error.message);
    else {
      setNotice(ok);
      await load();
    }
  }
  const toggle = (p: Product) =>
    updateProduct(
      p,
      { active: !p.active },
      p.active ? "Товар скрыт" : "Товар опубликован",
    );
  const archive = (p: Product) =>
    confirm(`Переместить «${p.name}» в корзину?`) &&
    updateProduct(p, { active: false, archived: true }, "Товар в корзине");
  const restore = (p: Product) =>
    updateProduct(p, { active: true, archived: false }, "Товар восстановлен");
  async function deleteForever(p: Product) {
    if (!supabase || !confirm(`Удалить «${p.name}» навсегда?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) setNotice(error.message);
    else {
      setNotice("Товар удалён");
      await load();
    }
  }
  async function savePromo(p: Promo) {
    if (!supabase) return;
    const active = promoDraft[p.code] ?? p.active;
    const { error } = await supabase
      .from("promo_codes")
      .update({ active })
      .eq("code", p.code);
    if (error) setNotice(error.message);
    else {
      setPromoDraft((d) => {
        const next = { ...d };
        delete next[p.code];
        return next;
      });
      setNotice(active ? "Промокод включён" : "Промокод отключён");
      await load();
    }
  }
  async function changeStatus(id: string, status: string) {
    if (!supabase) return;
    const { error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) setNotice(error.message);
    else await load();
  }
  async function saveReview(item: Review) {
    if (!supabase) return;
    const draft = reviewDraft[item.id] || { status: item.status, admin_reply: item.admin_reply || "" };
    setSaving(true);
    const { error } = await supabase
      .from("product_reviews")
      .update({
        status: draft.status,
        admin_reply: draft.admin_reply.trim(),
        replied_at: draft.admin_reply.trim() ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id);
    setSaving(false);
    if (error) setNotice(error.message);
    else {
      setReviewDraft((current) => {
        const next = { ...current };
        delete next[item.id];
        return next;
      });
      setNotice("Отзыв сохранён");
      await load();
    }
  }
  async function signOut() {
    await supabase?.auth.signOut();
    router.push(`/${locale}/login`);
  }
  async function copyReferral(source: string, code: string) {
    const url = `https://vasiliy2197463-jpg.github.io/exclusive-store-project-7/${locale}/?utm_source=${encodeURIComponent(source)}&ref=${encodeURIComponent(code)}`;
    await navigator.clipboard.writeText(url);
    setNotice(`Ссылка ${source} скопирована`);
  }

  if (loading)
    return (
      <div className="min-h-[60vh] bg-neutral-100 p-8">Загрузка панели…</div>
    );
  if (!allowed)
    return (
      <div className="min-h-[60vh] bg-neutral-100 p-8">
        <p>{message}</p>
        <Link href={`/${locale}/login`} className="mt-4 inline-block underline">
          Перейти ко входу
        </Link>
      </div>
    );
  const nav: [Tab, string][] = [
    ["overview", "Обзор"],
    ["analytics", "Аналитика"],
    ["products", "Товары"],
    ["stock", `Остатки (${inventory.length})`],
    ["trash", `Корзина (${trash.length})`],
    ["promos", "Промокоды"],
    ["orders", "Заказы"],
    ["customers", "Клиенты"],
    ["reviews", `Отзывы (${reviews.filter((item) => item.status === "pending").length})`],
    ["support", "Поддержка"],
  ];
  const empty = (text: string) => (
    <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500">
      {text}
    </div>
  );
  const fields = (v: ProductForm, set: (v: ProductForm) => void) => (
    <div className="grid gap-3">
      {[
        ["name", "Название", "text"],
        ["slug", "Slug (необязательно)", "text"],
        ["category", "Категория", "text"],
        ["price", "Цена", "number"],
        ["old_price", "Старая цена", "number"],
        ["stock", "Остаток", "number"],
      ].map(([key, ph, type]) => (
        <input
          key={key}
          required={["name", "price", "stock"].includes(key)}
          type={type}
          min={type === "number" ? 0 : undefined}
          value={v[key as keyof ProductForm]}
          onChange={(e) => set({ ...v, [key]: e.target.value })}
          placeholder={ph}
          className="rounded-xl border px-4 py-3"
        />
      ))}
      <textarea
        rows={4}
        value={v.description}
        onChange={(e) => set({ ...v, description: e.target.value })}
        placeholder="Описание"
        className="rounded-xl border px-4 py-3"
      />
    </div>
  );
  const thumb = (p: Product) => {
    const image = productImageMap.get(p.name.trim().toLowerCase());
    return (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100">
        {image ? (
          <img
            src={`/images/products/${image}`}
            alt=""
            className="h-12 w-12 object-contain"
          />
        ) : (
          <span className="text-2xl">📦</span>
        )}
      </div>
    );
  };
  const productList = (list: Product[], isTrash = false) =>
    list.length ? (
      <div className="grid gap-3">
        {list.map((p) => (
          <article key={p.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap justify-between gap-4">
              <div className="flex min-w-0 gap-4">
                {thumb(p)}
                <div className="min-w-0">
                  <h4 className="text-lg font-bold">{p.name}</h4>
                  <p className="break-all text-sm text-neutral-500">
                    {p.category || "Без категории"} · {p.slug}
                  </p>
                  <p className="mt-2">
                    <b>{Number(p.price).toLocaleString("ru-RU")} ₽</b> ·
                    Остаток: {p.stock}
                  </p>
                </div>
              </div>
              {!isTrash && (
                <span
                  className={`h-fit rounded-full px-3 py-1 text-xs ${p.active ? "bg-green-100" : "bg-neutral-200"}`}
                >
                  {p.active ? "Опубликован" : "Скрыт"}
                </span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {isTrash ? (
                <>
                  <button
                    onClick={() => restore(p)}
                    className="rounded-full bg-black px-4 py-2 text-sm text-white"
                  >
                    Восстановить
                  </button>
                  <button
                    onClick={() => deleteForever(p)}
                    className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600"
                  >
                    Удалить навсегда
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditing(p);
                      setEditForm(toForm(p));
                    }}
                    className="rounded-full bg-black px-4 py-2 text-sm text-white"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => toggle(p)}
                    className="rounded-full border px-4 py-2 text-sm"
                  >
                    {p.active ? "Скрыть" : "Опубликовать"}
                  </button>
                  <button
                    onClick={() => archive(p)}
                    className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600"
                  >
                    В корзину
                  </button>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    ) : (
      empty(isTrash ? "Корзина товаров пуста" : "Товары не найдены")
    );

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-neutral-100 text-neutral-900">
      <div className="mx-auto grid w-full min-w-0 max-w-[1600px] lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="min-w-0 max-w-full overflow-hidden bg-black p-5 text-white lg:min-h-screen lg:p-7">
          <div className="flex items-center justify-between gap-3 lg:block">
            <div className="min-w-0">
              <p className="truncate text-xs uppercase tracking-[.25em] text-white/50">
                Exclusive Store
              </p>
              <h1 className="mt-2 text-2xl font-bold">Админ-панель</h1>
            </div>
            <button
              onClick={signOut}
              className="shrink-0 rounded-full border border-white/25 px-4 py-2 text-sm lg:hidden"
            >
              Выйти
            </button>
          </div>
          <nav className="mt-6 grid w-full min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-col">
            {nav.map(([id, label]) => (
              <button
                key={id}
                onClick={() => {
                  setTab(id);
                  setNotice("");
                }}
                className={`min-w-0 break-words rounded-xl px-3 py-3 text-left text-sm font-medium sm:text-base ${tab === id ? "bg-white text-black" : "text-white/70 hover:bg-white/10"}`}
              >
                {label}
                {id === "orders" && stats.newOrders
                  ? ` (${stats.newOrders})`
                  : ""}
              </button>
            ))}
          </nav>
          <button
            onClick={signOut}
            className="mt-8 hidden w-full rounded-xl border border-white/25 px-4 py-3 lg:block"
          >
            Выйти
          </button>
        </aside>
        <main className="w-full min-w-0 overflow-hidden p-4 sm:p-6 xl:p-10">
          <header className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-neutral-500">Управление магазином</p>
              <h2 className="break-words text-2xl font-bold sm:text-4xl">
                {nav.find(([id]) => id === tab)?.[1]}
              </h2>
            </div>
            <Link
              href={`/${locale}`}
              className="shrink-0 rounded-full border bg-white px-5 py-2.5"
            >
              Открыть сайт
            </Link>
          </header>
          {notice && (
            <div className="mb-5 break-words rounded-xl bg-amber-100 p-4 text-sm">
              {notice}
            </div>
          )}
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["Товаров", stats.products],
                  ["Остаток, шт.", stats.stock],
                  ["Заказов", stats.orders],
                  ["Новых заказов", stats.newOrders],
                  ["Оборот", `${stats.revenue.toLocaleString("ru-RU")} ₽`],
                  ["Средний чек", `${Math.round(stats.averageOrder).toLocaleString("ru-RU")} ₽`],
                  ["Завершённый оборот", `${stats.completedRevenue.toLocaleString("ru-RU")} ₽`],
                  ["Клиентов", stats.customers],
                  ["Стоимость запасов", `${stats.stockValue.toLocaleString("ru-RU")} ₽`],
                  ["Открытых обращений", stats.support],
                ].map(([label, value]) => (
                  <article
                    key={String(label)}
                    className="min-w-0 rounded-3xl bg-white p-6 shadow-sm sm:p-8"
                  >
                    <p className="break-words text-neutral-500">{label}</p>
                    <p className="mt-3 break-words text-3xl font-black sm:text-4xl">
                      {value}
                    </p>
                  </article>
                ))}
              </div>
              <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black uppercase">Состояние заказов</h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      Актуальная сводка магазина Exclusive
                    </p>
                  </div>
                  <button
                    onClick={() => setTab("orders")}
                    className="rounded-full border px-5 py-2.5 font-semibold"
                  >
                    Открыть заказы
                  </button>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Новые", stats.newOrders, "bg-lime-300"],
                    ["В работе", stats.processingOrders, "bg-blue-100"],
                    ["Завершённые", stats.deliveredOrders, "bg-emerald-100"],
                    ["Отменённые", stats.cancelledOrders, "bg-red-100"],
                  ].map(([label, value, color]) => (
                    <article
                      key={String(label)}
                      className={`rounded-3xl p-5 sm:p-6 ${color}`}
                    >
                      <p className="text-neutral-600">{label}</p>
                      <p className="mt-2 text-4xl font-black">{value}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          )}
          {tab === "analytics" && (
            <div className="space-y-5">
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tight sm:text-5xl">
                  Посетители
                </h3>
                <p className="mt-2 text-neutral-500">
                  Посещения, рекламные источники, страницы перехода и UTM-метки.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ["Сейчас на сайте", visitorAnalytics.online],
                  ["Уникальных сегодня", visitorAnalytics.uniqueToday],
                  ["Просмотров сегодня", visitorAnalytics.todayViews.length],
                ].map(([label, value]) => (
                  <article
                    key={String(label)}
                    className="rounded-3xl bg-white p-6 shadow-sm"
                  >
                    <p className="text-sm text-neutral-500">{label}</p>
                    <p className="mt-4 text-4xl font-black">{value}</p>
                  </article>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {(
                  [
                    ["today", "Сегодня", visitorAnalytics.todayViews],
                    ["yesterday", "Вчера", visitorAnalytics.yesterdayViews],
                    ["earlier", "Ранее", visitorAnalytics.earlierViews],
                    ["mine", "Мои посещения", visitorAnalytics.mineViews],
                  ] as [VisitorPeriod, string, PageView[]][]
                ).map(([id, label, periodViews]) => {
                  const active = visitorPeriod === id;
                  return (
                    <button
                      key={String(id)}
                      onClick={() => {
                        setVisitorPeriod(id as VisitorPeriod);
                        setExpandedVisitorId("");
                      }}
                      className={`rounded-3xl border p-6 text-left transition ${active ? "border-black bg-black text-white" : "border-neutral-200 bg-white hover:border-black"}`}
                    >
                      <p className={active ? "text-white/60" : "text-neutral-500"}>
                        {label}
                      </p>
                      <p className="mt-3 text-2xl font-black">
                        {new Set(periodViews.map((v) => v.visitor_id)).size}{" "}
                        посетителей
                      </p>
                      <p className={active ? "text-white/60" : "text-neutral-400"}>
                        {periodViews.length} просмотров
                      </p>
                    </button>
                  );
                })}
              </div>
              <section className="rounded-3xl bg-white p-5 shadow-sm">
                <label className="font-bold" htmlFor="visitor-device">
                  Показать устройство
                </label>
                <p className="text-sm text-neutral-500">
                  Ваши визиты не входят в общую статистику.
                </p>
                <select
                  id="visitor-device"
                  value={visitorDevice}
                  onChange={(e) => setVisitorDevice(e.target.value)}
                  className="mt-4 w-full rounded-full border bg-white px-5 py-3 font-semibold"
                >
                  <option value="all">Все посетители</option>
                  <option value="desktop">Компьютеры</option>
                  <option value="phone">Телефоны и планшеты</option>
                </select>
              </section>
              <details className="group rounded-3xl bg-white p-5 shadow-sm">
                <summary className="cursor-pointer list-none text-lg font-bold">
                  <span className="mr-2 inline-block transition group-open:rotate-90">▶</span>
                  Ссылки для рекламы
                </summary>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <button onClick={() => copyReferral("instagram", "instagram-main")} className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-orange-500 px-4 py-4 font-semibold text-white">
                    <AiOutlineInstagram className="h-7 w-7" /> Instagram
                  </button>
                  <button onClick={() => copyReferral("telegram", "telegram-main")} className="flex items-center justify-center gap-3 rounded-2xl bg-sky-500 px-4 py-4 font-semibold text-white">
                    <FaTelegramPlane className="h-6 w-6" /> Telegram
                  </button>
                  <button onClick={() => copyReferral("vk", "vk-main")} className="flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-4 py-4 font-semibold text-white">
                    <FaVk className="h-7 w-7" /> ВКонтакте
                  </button>
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <input
                    value={refCode}
                    onChange={(e) => setRefCode(slugify(e.target.value))}
                    className="min-w-0 flex-1 rounded-xl border px-4 py-3"
                    placeholder="partner-01"
                  />
                  <button
                    onClick={() => copyReferral("referral", refCode || "partner-01")}
                    className="rounded-xl bg-black px-5 py-3 text-white"
                  >
                    Скопировать свою ссылку
                  </button>
                </div>
              </details>
              {views.length ? (
                <>
                  <section className="space-y-3">
                    <h3 className="text-xl font-black">Посетители и действия</h3>
                    {visitorAnalytics.groups.length ? (
                      visitorAnalytics.groups.map(({ visitorId, visits }) => {
                        const opened = expandedVisitorId === visitorId;
                        const latest = visits[0];
                        const sources = Array.from(
                          new Set(visits.map((v) => v.source || "direct")),
                        ).join(", ");
                        return (
                          <article key={visitorId} className="overflow-hidden rounded-3xl bg-white shadow-sm">
                            <button
                              onClick={() => setExpandedVisitorId(opened ? "" : visitorId)}
                              className="flex w-full flex-wrap items-center justify-between gap-4 p-5 text-left"
                            >
                              <div className="min-w-0">
                                <p className="font-black">Гость {visitorId.slice(0, 8)}</p>
                                <p className="break-words text-sm text-neutral-500">
                                  {sources} · {latest.device} · {latest.platform}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">{visits.length} действий</p>
                                <p className="text-sm text-neutral-500">
                                  {new Date(latest.created_at).toLocaleString("ru-RU")}
                                </p>
                              </div>
                            </button>
                            {opened && (
                              <div className="border-t bg-neutral-50 p-4 sm:p-5">
                                <div className="space-y-2">
                                  {visits.map((visit) => (
                                    <div key={visit.id} className="grid gap-1 rounded-2xl bg-white p-4 sm:grid-cols-[150px_minmax(0,1fr)_180px] sm:gap-4">
                                      <span className="text-sm text-neutral-500">
                                        {new Date(visit.created_at).toLocaleString("ru-RU")}
                                      </span>
                                      <span className="min-w-0 break-all font-medium">{visit.path}</span>
                                      <span className="break-all text-sm">
                                        {visit.source || "direct"}{visit.ref_code ? ` / ${visit.ref_code}` : ""}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </article>
                        );
                      })
                    ) : (
                      empty("В выбранном периоде посещений пока нет")
                    )}
                  </section>
                  <details className="rounded-3xl bg-white p-5 shadow-sm">
                    <summary className="cursor-pointer text-lg font-bold">
                      Сводная статистика
                    </summary>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {[
                      ["Источники трафика", analytics.sources],
                      ["Реферальные коды", analytics.refs],
                      ["Страницы входа", analytics.entries],
                      ["Страницы выхода", analytics.exits],
                      ["Устройства", analytics.devices],
                      ["Платформы", analytics.platforms],
                      ["Посещённые страницы", analytics.pages],
                    ].map(([title, items]) => (
                      <section
                        key={String(title)}
                        className="min-w-0 rounded-2xl bg-white p-5 shadow-sm"
                      >
                        <h3 className="mb-4 text-lg font-bold">
                          {String(title)}
                        </h3>
                        <div className="space-y-3">
                          {(items as [string, number][])
                            .slice(0, 12)
                            .map(([name, count]) => (
                              <div
                                key={name}
                                className="flex min-w-0 items-center justify-between gap-3 border-b pb-2"
                              >
                                <span className="min-w-0 break-all text-sm">
                                  {name}
                                </span>
                                <b>{count}</b>
                              </div>
                            ))}
                        </div>
                      </section>
                    ))}
                    </div>
                  </details>
                </>
              ) : (
                empty(
                  "Статистика начнёт собираться после подключения таблицы аналитики",
                )
              )}
            </div>
          )}
          {tab === "products" && (
            <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
              <form
                onSubmit={addProduct}
                className="h-fit rounded-2xl bg-white p-5 shadow-sm"
              >
                <h3 className="mb-4 text-xl font-bold">Новый товар</h3>
                {fields(form, setForm)}
                <button
                  disabled={saving}
                  className="mt-3 w-full rounded-xl bg-black p-3 font-semibold text-white"
                >
                  {saving ? "Сохраняем…" : "Добавить товар"}
                </button>
              </form>
              <section>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Найти товар…"
                  className="mb-4 w-full rounded-full border bg-white px-5 py-3"
                />
                {productList(visible)}
              </section>
            </div>
          )}
          {editing && (
            <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/60 p-4">
              <form
                onSubmit={saveProduct}
                className="mx-auto my-8 max-w-xl rounded-3xl bg-white p-6"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h3 className="text-2xl font-bold">Изменить товар</h3>
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="rounded-full border px-4 py-2"
                  >
                    Закрыть
                  </button>
                </div>
                {fields(editForm, setEditForm)}
                <button
                  disabled={saving}
                  className="mt-4 w-full rounded-xl bg-black p-3 font-semibold text-white"
                >
                  Сохранить
                </button>
              </form>
            </div>
          )}
          {tab === "stock" &&
            (inventory.length ? (
              <div className="grid gap-3">
                {inventory.map((p) => {
                  const amount = stockDraft[p.id] ?? p.stock,
                    changed = amount !== p.stock;
                  return (
                    <article
                      key={p.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        {thumb(p)}
                        <div className="min-w-0">
                          <b className="break-words">{p.name}</b>
                          <p
                            className={`text-sm ${amount <= 5 ? "text-red-600" : "text-neutral-500"}`}
                          >
                            {amount === 0
                              ? "Нет в наличии"
                              : `Остаток: ${amount}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            setStockDraft((d) => ({
                              ...d,
                              [p.id]: Math.max(0, amount - 1),
                            }))
                          }
                          className="h-10 w-10 rounded-full border"
                        >
                          −
                        </button>
                        <b className="min-w-10 py-2 text-center">{amount}</b>
                        <button
                          onClick={() =>
                            setStockDraft((d) => ({ ...d, [p.id]: amount + 1 }))
                          }
                          className="h-10 w-10 rounded-full bg-black text-white"
                        >
                          +
                        </button>
                        <button
                          disabled={!changed}
                          onClick={async () => {
                            await updateProduct(
                              p,
                              { stock: amount },
                              "Остаток сохранён",
                            );
                            setStockDraft((d) => {
                              const next = { ...d };
                              delete next[p.id];
                              return next;
                            });
                          }}
                          className="ml-1 rounded-full bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
                        >
                          Сохранить
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              empty("Товаров пока нет")
            ))}
          {tab === "trash" && productList(trash, true)}
          {tab === "promos" &&
            (promos.length ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {promos.map((p) => {
                  const active = promoDraft[p.code] ?? p.active,
                    changed = active !== p.active;
                  return (
                    <article
                      key={p.code}
                      className="rounded-2xl bg-white p-6 shadow-sm"
                    >
                      <p className="text-sm text-neutral-500">Промокод</p>
                      <h3 className="mt-1 text-2xl font-black">{p.code}</h3>
                      <p className="mt-4 text-5xl font-black">
                        {p.discount_percent}%
                      </p>
                      <button
                        onClick={() =>
                          setPromoDraft((d) => ({ ...d, [p.code]: !active }))
                        }
                        className={`mt-5 w-full rounded-xl p-3 font-semibold ${active ? "bg-black text-white" : "bg-neutral-200"}`}
                      >
                        {active ? "Включён — отключить" : "Отключён — включить"}
                      </button>
                      <button
                        disabled={!changed}
                        onClick={() => savePromo(p)}
                        className="mt-2 w-full rounded-xl border border-black p-3 font-semibold disabled:cursor-not-allowed disabled:border-neutral-200 disabled:text-neutral-400"
                      >
                        Сохранить
                      </button>
                    </article>
                  );
                })}
              </div>
            ) : (
              empty(
                "Промокоды SALE20, SALE30, SALE50 и SALE70 появятся после миграции",
              )
            ))}
          {tab === "orders" &&
            (orders.length ? (
              <div className="space-y-4">
                {orders.map((o) => (
                  <article key={o.id} className="rounded-2xl bg-white p-5">
                    <div className="flex flex-wrap justify-between gap-4">
                      <div>
                        <p className="text-xs text-neutral-500">
                          #{o.id.slice(0, 8)} ·{" "}
                          {new Date(o.created_at).toLocaleString("ru-RU")}
                        </p>
                        <h3 className="mt-1 text-xl font-bold">
                          {o.customer_name || "Покупатель"}
                        </h3>
                        <p className="break-all text-sm">
                          {o.customer_email} · {o.customer_phone}
                        </p>
                        <p className="mt-2 text-sm">{o.shipping_address}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {Number(o.total).toLocaleString("ru-RU")} ₽
                        </p>
                        <select
                          value={o.status}
                          onChange={(e) => changeStatus(o.id, e.target.value)}
                          className="mt-3 rounded-xl border px-3 py-2"
                        >
                          {statuses.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              empty("Заказов пока нет")
            ))}
          {tab === "customers" &&
            (customers.length ? (
              <div className="overflow-x-auto rounded-2xl bg-white">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="p-4">Имя</th>
                      <th className="p-4">Телефон</th>
                      <th className="p-4">Роль</th>
                      <th className="p-4">Дата</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id} className="border-b">
                        <td className="p-4">{c.full_name || "Без имени"}</td>
                        <td className="p-4">{c.phone || "—"}</td>
                        <td className="p-4">{c.role}</td>
                        <td className="p-4">
                          {new Date(c.created_at).toLocaleDateString("ru-RU")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              empty("Клиентов пока нет")
            ))}
          {tab === "reviews" &&
            (reviews.length ? (
              <div className="grid gap-4">
                {reviews.map((item) => {
                  const draft = reviewDraft[item.id] || {
                    status: item.status,
                    admin_reply: item.admin_reply || "",
                  };
                  const changed = draft.status !== item.status || draft.admin_reply !== (item.admin_reply || "");
                  return (
                    <article key={item.id} className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">
                      <div className="flex flex-wrap justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm text-neutral-500">{item.product_name}</p>
                          <h3 className="mt-1 break-words text-xl font-black">{item.author_name}</h3>
                          <p className="mt-1 text-amber-500">{"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}</p>
                        </div>
                        <p className="text-sm text-neutral-500">{new Date(item.created_at).toLocaleString("ru-RU")}</p>
                      </div>
                      <p className="mt-4 whitespace-pre-wrap break-words leading-7">{item.body}</p>
                      <div className="mt-5 grid gap-3 md:grid-cols-[220px_minmax(0,1fr)]">
                        <select
                          value={draft.status}
                          onChange={(event) => setReviewDraft((current) => ({ ...current, [item.id]: { ...draft, status: event.target.value as Review["status"] } }))}
                          className="rounded-xl border bg-white px-4 py-3"
                        >
                          <option value="pending">На модерации</option>
                          <option value="published">Опубликовать</option>
                          <option value="rejected">Скрыть</option>
                        </select>
                        <textarea
                          value={draft.admin_reply}
                          onChange={(event) => setReviewDraft((current) => ({ ...current, [item.id]: { ...draft, admin_reply: event.target.value } }))}
                          placeholder="Ответ магазина покупателю"
                          className="min-h-24 rounded-xl border p-4"
                        />
                      </div>
                      <button
                        disabled={!changed || saving}
                        onClick={() => saveReview(item)}
                        className="mt-3 rounded-xl bg-black px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
                      >
                        Сохранить
                      </button>
                    </article>
                  );
                })}
              </div>
            ) : (
              empty("Отзывы пока не поступали")
            ))}
          {tab === "support" &&
            (threads.length ? (
              <div className="grid gap-3">
                {threads.map((t) => (
                  <article key={t.id} className="rounded-2xl bg-white p-5">
                    <b>Обращение #{t.id.slice(0, 8)}</b>
                    <p className="text-sm text-neutral-500">
                      {new Date(t.last_message_at).toLocaleString("ru-RU")} ·{" "}
                      {t.status}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              empty("Обращений пока нет")
            ))}
        </main>
      </div>
    </div>
  );
}
