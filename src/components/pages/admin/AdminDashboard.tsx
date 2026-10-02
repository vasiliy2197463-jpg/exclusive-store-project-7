"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Tab = "overview" | "products" | "stock" | "orders" | "customers" | "support";
type Product = { id:number; name:string; slug:string; category:string; price:number; old_price:number|null; stock:number; active:boolean; description:string };
type Order = { id:string; status:string; total:number; customer_name:string; customer_email:string; customer_phone:string; shipping_address:string; created_at:string };
type Customer = { id:string; full_name:string; phone:string; role:string; created_at:string };
type Thread = { id:string; status:string; last_message_at:string };
const blank = { name:"", slug:"", category:"", price:"", old_price:"", stock:"0", description:"" };
const statuses = ["new","confirmed","processing","shipped","delivered","cancelled","refunded"];

export default function AdminDashboard() {
  const supabase = getSupabaseBrowserClient();
  const locale = usePathname().split("/")[1] || "ru";
  const router = useRouter();
  const [tab,setTab] = useState<Tab>("overview");
  const [loading,setLoading] = useState(true);
  const [allowed,setAllowed] = useState(false);
  const [message,setMessage] = useState("");
  const [notice,setNotice] = useState("");
  const [products,setProducts] = useState<Product[]>([]);
  const [orders,setOrders] = useState<Order[]>([]);
  const [customers,setCustomers] = useState<Customer[]>([]);
  const [threads,setThreads] = useState<Thread[]>([]);
  const [form,setForm] = useState(blank);
  const [saving,setSaving] = useState(false);

  const load = useCallback(async()=>{
    if(!supabase) return;
    const [p,o,c,t] = await Promise.all([
      supabase.from("products").select("*").order("created_at",{ascending:false}),
      supabase.from("orders").select("*").order("created_at",{ascending:false}),
      supabase.from("profiles").select("id,full_name,phone,role,created_at").order("created_at",{ascending:false}),
      supabase.from("support_threads").select("id,status,last_message_at").order("last_message_at",{ascending:false}),
    ]);
    setProducts((p.data||[]) as Product[]); setOrders((o.data||[]) as Order[]);
    setCustomers((c.data||[]) as Customer[]); setThreads((t.data||[]) as Thread[]);
    const error=p.error||o.error||c.error||t.error; if(error) setNotice(error.message);
  },[supabase]);

  useEffect(()=>{(async()=>{
    if(!supabase){setMessage("Supabase не подключён");setLoading(false);return;}
    const {data}=await supabase.auth.getUser();
    if(!data.user){setMessage("Сначала войдите в аккаунт");setLoading(false);return;}
    const {data:profile}=await supabase.from("profiles").select("role").eq("id",data.user.id).single();
    if(!profile||!["support","manager","admin"].includes(profile.role)){setMessage("Нет доступа к административной панели");setLoading(false);return;}
    setAllowed(true); await load(); setLoading(false);
  })()},[load,supabase]);

  const stats=useMemo(()=>({products:products.length,stock:products.reduce((s,p)=>s+Number(p.stock||0),0),orders:orders.length,newOrders:orders.filter(o=>o.status==="new").length,customers:customers.filter(c=>c.role==="customer").length,support:threads.filter(t=>t.status!=="closed").length}),[products,orders,customers,threads]);
  const lowStock=products.filter(p=>Number(p.stock)<=5);

  async function addProduct(e:FormEvent){e.preventDefault();if(!supabase)return;setSaving(true);setNotice("");
    const slug=(form.slug||form.name).toLowerCase().trim().replace(/[^a-z0-9а-яё]+/gi,"-").replace(/^-|-$/g,"");
    const {error}=await supabase.from("products").insert({name:form.name.trim(),slug,category:form.category.trim(),description:form.description.trim(),price:Number(form.price),old_price:form.old_price?Number(form.old_price):null,stock:Number(form.stock),active:true});
    if(error)setNotice(error.message);else{setForm(blank);setNotice("Товар добавлен");await load()}setSaving(false);
  }
  async function toggleProduct(p:Product){if(!supabase)return;const {error}=await supabase.from("products").update({active:!p.active}).eq("id",p.id);if(error)setNotice(error.message);else await load()}
  async function removeProduct(p:Product){if(!supabase||!confirm(`Удалить «${p.name}»?`))return;const {error}=await supabase.from("products").delete().eq("id",p.id);if(error)setNotice(error.message);else await load()}
  async function changeStock(p:Product,stock:number){if(!supabase)return;const {error}=await supabase.from("products").update({stock:Math.max(0,stock)}).eq("id",p.id);if(error)setNotice(error.message);else await load()}
  async function changeStatus(id:string,status:string){if(!supabase)return;const {error}=await supabase.from("orders").update({status,updated_at:new Date().toISOString()}).eq("id",id);if(error)setNotice(error.message);else await load()}
  async function signOut(){await supabase?.auth.signOut();router.push(`/${locale}/login`)}

  if(loading)return <div className="min-h-[60vh] bg-neutral-100 p-8">Загрузка панели…</div>;
  if(!allowed)return <div className="min-h-[60vh] bg-neutral-100 p-8"><p>{message}</p><Link href={`/${locale}/login`} className="mt-4 inline-block underline">Перейти ко входу</Link></div>;
  const nav:[Tab,string][]=[["overview","Обзор"],["products","Товары"],["stock","Остатки"],["orders","Заказы"],["customers","Клиенты"],["support","Поддержка"]];
  const empty=(text:string)=><div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500">{text}</div>;

  return <div className="min-h-screen bg-neutral-100 text-neutral-900"><div className="mx-auto grid max-w-[1600px] lg:grid-cols-[250px_minmax(0,1fr)]">
    <aside className="bg-black p-5 text-white lg:min-h-screen lg:p-7"><div className="flex items-center justify-between lg:block"><div><p className="text-xs uppercase tracking-[.25em] text-white/50">Exclusive Store</p><h1 className="mt-2 text-2xl font-bold">Админ-панель</h1></div><button onClick={signOut} className="rounded-full border border-white/25 px-4 py-2 text-sm lg:hidden">Выйти</button></div><nav className="mt-6 flex gap-2 overflow-x-auto pb-2 lg:flex-col">{nav.map(([id,label])=><button key={id} onClick={()=>setTab(id)} className={`whitespace-nowrap rounded-xl px-4 py-3 text-left font-medium ${tab===id?"bg-white text-black":"text-white/70 hover:bg-white/10"}`}>{label}{id==="orders"&&stats.newOrders?` (${stats.newOrders})`:""}</button>)}</nav><button onClick={signOut} className="mt-8 hidden w-full rounded-xl border border-white/25 px-4 py-3 lg:block">Выйти</button></aside>
    <main className="min-w-0 p-4 sm:p-7 xl:p-10"><header className="mb-7 flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm text-neutral-500">Управление магазином</p><h2 className="text-2xl font-bold sm:text-4xl">{nav.find(([id])=>id===tab)?.[1]}</h2></div><Link href={`/${locale}`} className="rounded-full border bg-white px-5 py-2.5">Открыть сайт</Link></header>{notice&&<div className="mb-5 rounded-xl bg-amber-100 p-4 text-sm">{notice}</div>}

      {tab==="overview"&&<><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[["Товаров",stats.products],["Остаток, шт.",stats.stock],["Заказов",stats.orders],["Новых заказов",stats.newOrders],["Клиентов",stats.customers],["Обращений",stats.support]].map(([l,v])=><article key={l} className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-sm text-neutral-500">{l}</p><p className="mt-2 text-4xl font-bold">{v}</p></article>)}</div><div className="mt-6 grid gap-5 xl:grid-cols-2"><section className="rounded-2xl bg-white p-6"><h3 className="text-xl font-bold">Последние заказы</h3><div className="mt-4 space-y-3">{orders.slice(0,5).map(o=><button key={o.id} onClick={()=>setTab("orders")} className="flex w-full justify-between rounded-xl bg-neutral-100 p-4"><span>{o.customer_name||o.customer_email||"Покупатель"}</span><b>{Number(o.total).toLocaleString("ru-RU")} ₽</b></button>)}{!orders.length&&<p className="text-neutral-500">Заказов пока нет</p>}</div></section><section className="rounded-2xl bg-white p-6"><h3 className="text-xl font-bold">Быстрые действия</h3><div className="mt-4 grid gap-3"><button onClick={()=>setTab("products")} className="rounded-xl bg-black p-4 text-left text-white">Добавить товар</button><button onClick={()=>setTab("orders")} className="rounded-xl bg-neutral-100 p-4 text-left">Обработать заказы</button><button onClick={()=>setTab("support")} className="rounded-xl bg-neutral-100 p-4 text-left">Открыть поддержку</button></div></section></div></>}

      {tab==="products"&&<div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]"><form onSubmit={addProduct} className="h-fit rounded-2xl bg-white p-5 shadow-sm"><h3 className="text-xl font-bold">Новый товар</h3><div className="mt-4 grid gap-3">{[["name","Название","text"],["slug","Slug (необязательно)","text"],["category","Категория","text"],["price","Цена","number"],["old_price","Старая цена","number"],["stock","Остаток","number"]].map(([key,ph,type])=><input key={key} required={["name","price","stock"].includes(key)} type={type} min={type==="number"?0:undefined} value={form[key as keyof typeof form]} onChange={e=>setForm(c=>({...c,[key]:e.target.value}))} placeholder={ph} className="rounded-xl border px-4 py-3"/>)}<textarea rows={4} value={form.description} onChange={e=>setForm(c=>({...c,description:e.target.value}))} placeholder="Описание" className="rounded-xl border px-4 py-3"/><button disabled={saving} className="rounded-xl bg-black p-3 font-semibold text-white">{saving?"Сохраняем…":"Добавить товар"}</button></div></form><section>{products.length?<div className="grid gap-3">{products.map(p=><article key={p.id} className="rounded-2xl bg-white p-5 shadow-sm"><div className="flex flex-wrap justify-between gap-4"><div><h4 className="text-lg font-bold">{p.name}</h4><p className="text-sm text-neutral-500">{p.category||"Без категории"} · {p.slug}</p><p className="mt-2"><b>{Number(p.price).toLocaleString("ru-RU")} ₽</b> · Остаток: {p.stock}</p></div><span className={`h-fit rounded-full px-3 py-1 text-xs ${p.active?"bg-green-100":"bg-neutral-200"}`}>{p.active?"Опубликован":"Скрыт"}</span></div><div className="mt-4 flex gap-2"><button onClick={()=>toggleProduct(p)} className="rounded-full border px-4 py-2 text-sm">{p.active?"Скрыть":"Опубликовать"}</button><button onClick={()=>removeProduct(p)} className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600">Удалить</button></div></article>)}</div>:empty("Добавьте первый товар через форму")}</section></div>}

      {tab==="stock"&&(lowStock.length?<div className="grid gap-3">{lowStock.map(p=><article key={p.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5"><div><b>{p.name}</b><p className="text-sm text-neutral-500">{p.stock===0?"Нет в наличии":`Осталось: ${p.stock}`}</p></div><div className="flex gap-2"><button onClick={()=>changeStock(p,p.stock-1)} className="h-10 w-10 rounded-full border">−</button><span className="min-w-10 py-2 text-center font-bold">{p.stock}</span><button onClick={()=>changeStock(p,p.stock+1)} className="h-10 w-10 rounded-full bg-black text-white">+</button></div></article>)}</div>:empty("Все товары имеют достаточный остаток или каталог пуст") )}

      {tab==="orders"&&(orders.length?<div className="space-y-4">{orders.map(o=><article key={o.id} className="rounded-2xl bg-white p-5"><div className="flex flex-wrap justify-between gap-4"><div><p className="text-xs text-neutral-500">#{o.id.slice(0,8)} · {new Date(o.created_at).toLocaleString("ru-RU")}</p><h3 className="mt-1 text-xl font-bold">{o.customer_name||"Покупатель"}</h3><p className="text-sm">{o.customer_email} · {o.customer_phone}</p><p className="mt-2 text-sm">{o.shipping_address}</p></div><div className="text-right"><p className="text-2xl font-bold">{Number(o.total).toLocaleString("ru-RU")} ₽</p><select value={o.status} onChange={e=>changeStatus(o.id,e.target.value)} className="mt-3 rounded-xl border px-3 py-2">{statuses.map(s=><option key={s}>{s}</option>)}</select></div></div></article>)}</div>:empty("Заказов пока нет. После оформления они появятся здесь"))}

      {tab==="customers"&&(customers.length?<div className="overflow-x-auto rounded-2xl bg-white"><table className="min-w-full text-left"><thead className="border-b bg-neutral-50"><tr><th className="p-4">Имя</th><th className="p-4">Телефон</th><th className="p-4">Роль</th><th className="p-4">Регистрация</th></tr></thead><tbody>{customers.map(c=><tr key={c.id} className="border-b last:border-0"><td className="p-4 font-medium">{c.full_name||"Без имени"}</td><td className="p-4">{c.phone||"—"}</td><td className="p-4">{c.role}</td><td className="p-4">{new Date(c.created_at).toLocaleDateString("ru-RU")}</td></tr>)}</tbody></table></div>:empty("Клиентов пока нет"))}
      {tab==="support"&&(threads.length?<div className="grid gap-3">{threads.map(t=><article key={t.id} className="rounded-2xl bg-white p-5"><b>Обращение #{t.id.slice(0,8)}</b><p className="text-sm text-neutral-500">{new Date(t.last_message_at).toLocaleString("ru-RU")} · {t.status}</p></article>)}</div>:empty("Обращений пока нет"))}
    </main>
  </div></div>;
}
