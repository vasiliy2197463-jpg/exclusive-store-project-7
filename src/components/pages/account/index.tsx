"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiSettings, FiX } from "react-icons/fi";
import { twMerge as tw } from "tailwind-merge";
import { interSemiboldFont, poppinsMediumFont } from "fonts";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Profile = { full_name:string; phone:string; company_name:string; street_address:string; apartment:string; city:string; role:string; email:string };
const empty:Profile={full_name:"",phone:"",company_name:"",street_address:"",apartment:"",city:"",role:"customer",email:""};

export default function AccountSection({ dict }: { dict: any }) {
  const supabase=getSupabaseBrowserClient();
  const locale=usePathname().split("/")[1]||"ru";
  const [profile,setProfile]=useState<Profile>(empty);
  const [draft,setDraft]=useState<Profile>(empty);
  const [editing,setEditing]=useState(false);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState("");
  const [authenticated,setAuthenticated]=useState(false);

  useEffect(()=>{(async()=>{
    if(!supabase){setMessage("Supabase не подключён");setLoading(false);return;}
    const {data:auth}=await supabase.auth.getUser();
    if(!auth.user){setMessage("Войдите в аккаунт, чтобы открыть профиль");setLoading(false);return;}
    setAuthenticated(true);
    const {data,error}=await supabase.from("profiles").select("full_name,phone,company_name,street_address,apartment,city,role").eq("id",auth.user.id).single();
    if(error){setMessage(error.message);setLoading(false);return;}
    const next={...empty,...data,email:auth.user.email||""} as Profile;
    setProfile(next);setDraft(next);setLoading(false);
  })()},[supabase]);

  async function save(){
    if(!supabase)return;setSaving(true);setMessage("");
    const {data:auth}=await supabase.auth.getUser();
    if(!auth.user){setMessage("Сессия завершена. Войдите снова.");setSaving(false);return;}
    const payload={full_name:draft.full_name.trim(),phone:draft.phone.trim(),company_name:draft.company_name.trim(),street_address:draft.street_address.trim(),apartment:draft.apartment.trim(),city:draft.city.trim(),updated_at:new Date().toISOString()};
    const {error}=await supabase.from("profiles").update(payload).eq("id",auth.user.id);
    if(error)setMessage(error.message);else{setProfile({...draft,email:profile.email,role:profile.role});setEditing(false);setMessage("Профиль сохранён")}
    setSaving(false);
  }

  if(loading)return <section className="min-h-[40vh] py-8">Загрузка профиля…</section>;
  const fields:[keyof Profile,string][]=[["full_name",dict.pages.account.name],["city",dict.pages.account.city],["street_address",dict.pages.account.streetAddress],["apartment",dict.pages.account.apartment],["company_name",dict.pages.account.companyName],["email",dict.pages.account.email],["phone",dict.pages.account.phoneNumber]];
  const isStaff=["support","manager","admin"].includes(profile.role);

  if (!authenticated) {
    return <section className="flex min-h-[42vh] flex-col items-start justify-center gap-6 rounded-3xl bg-neutral-50 p-6 sm:p-10">
      <h1 className={tw("text-3xl text-color-secondary-2 max-2xl:text-2xl",interSemiboldFont.className)}>{dict.pages.account.yourProfile}</h1>
      <p className="max-w-xl text-lg">Войдите в аккаунт или зарегистрируйтесь, чтобы открыть профиль, историю заказов и настройки.</p>
      <div className="flex flex-wrap gap-3">
        <Link href={`/${locale}/login`} className="rounded-full bg-color-secondary-2 px-6 py-3 font-semibold text-white">Войти в аккаунт</Link>
        <Link href={`/${locale}/sign-up`} className="rounded-full border border-neutral-300 bg-white px-6 py-3 font-semibold">Зарегистрироваться</Link>
      </div>
    </section>;
  }

  return <section className="flex min-w-0 flex-col items-start gap-8">
    <div className="flex w-full flex-wrap items-center justify-between gap-4"><h1 className={tw("text-3xl text-color-secondary-2 max-2xl:text-2xl",interSemiboldFont.className)}>{dict.pages.account.yourProfile}</h1><div className="flex flex-wrap gap-3">{isStaff&&<Link href={`/${locale}/admin`} className="rounded-full bg-black px-5 py-3 font-semibold text-white">Открыть админ-панель</Link>}{authenticated?<button onClick={()=>{setDraft(profile);setEditing(v=>!v)}} className="flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-3 font-semibold">{editing?<FiX/>:<FiSettings/>}{editing?"Закрыть":"Редактировать"}</button>:<Link href={`/${locale}/login`} className="rounded-full bg-color-secondary-2 px-6 py-3 font-semibold text-white">Войти в аккаунт</Link>}</div></div>
    {message&&<p className={`rounded-xl px-4 py-3 text-sm ${message==="Профиль сохранён"?"bg-green-100":"bg-amber-100"}`}>{message}</p>}
    {editing?<div className="w-full max-w-4xl rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7"><div className="grid gap-5 sm:grid-cols-2">{fields.filter(([key])=>key!=="email").map(([key,label])=><label key={key} className="grid gap-2"><span className="font-semibold">{label}</span><input value={draft[key]} onChange={e=>setDraft(current=>({...current,[key]:e.target.value}))} className="min-w-0 rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"/></label>)}</div><label className="mt-5 grid gap-2"><span className="font-semibold">{dict.pages.account.email}</span><input disabled value={profile.email} className="rounded-xl border bg-neutral-100 px-4 py-3 text-neutral-500"/><small className="text-neutral-500">Email меняется отдельно через настройки авторизации.</small></label><button onClick={save} disabled={saving} className="mt-6 w-full rounded-xl bg-color-secondary-2 px-5 py-3 font-semibold text-white disabled:opacity-50 sm:w-auto">{saving?"Сохраняем…":"Сохранить изменения"}</button></div>:<div className="grid w-full min-w-0 grid-cols-4 gap-x-10 gap-y-12 max-3xl:grid-cols-3 max-xl:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-y-7">{fields.map(([key,label])=><div key={key} className="min-w-0 space-y-1"><h3 className={tw("text-2xl capitalize leading-tight max-2xl:text-xl",poppinsMediumFont.className)}>{label}</h3><p className="break-words text-lg max-2xl:text-base">{profile[key]||"Не указано"}</p></div>)}</div>}
  </section>;
}
