"use client";

import { FormEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import InputWithLine from "@/components/inputs/InputWithLine";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginForm({ dict }: { dict: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const locale = usePathname().split("/")[1] || "ru";
  const router = useRouter();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Supabase ещё не подключён. Добавьте ключи проекта в .env.local");
      setSubmitting(false);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else router.push(`/${locale}/account`);
    setSubmitting(false);
  }

  return (
    <form className="flex flex-col gap-14 max-lg:gap-8" onSubmit={submit}>
      <div className="flex flex-col gap-12 max-lg:gap-8">
        <InputWithLine props={{ type: "email", placeholder: dict.pages.registration.login.emailOrPhone, required: true, value: email, onChange: (e) => setEmail(e.target.value) }} />
        <InputWithLine props={{ type: "password", placeholder: dict.pages.registration.login.password, required: true, value: password, onChange: (e) => setPassword(e.target.value) }} />
      </div>
      <div className="flex items-center justify-between gap-5 max-sm:flex-col max-sm:items-stretch">
        <PrimaryButton buttonProps={{ type: "submit", disabled: submitting }}>{submitting ? "Входим…" : dict.pages.registration.login.login}</PrimaryButton>
        <button type="button" className="text-color-button-1 text-lg capitalize max-2xl:text-base">{dict.pages.registration.login.forgetPassword}</button>
      </div>
      {message && <p className="text-sm text-color-button-1" role="status">{message}</p>}
    </form>
  );
}
