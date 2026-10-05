"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import InputWithLine from "@/components/inputs/InputWithLine";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";

function loginError(message: string) {
  if (message.toLowerCase().includes("invalid login credentials")) {
    return "Неверный email или пароль. Если вы ещё не регистрировались в этом магазине, создайте новый аккаунт.";
  }
  if (message.toLowerCase().includes("email not confirmed")) {
    return "Подтвердите email по ссылке из письма, затем повторите вход.";
  }
  return message;
}

export default function LoginForm({ dict }: { dict: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [checkingRecovery, setCheckingRecovery] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const locale = usePathname().split("/")[1] || "ru";
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const auth = supabase.auth;

    let active = true;
    const pending = window.localStorage.getItem("exclusive-password-recovery") === "pending";
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const search = new URLSearchParams(window.location.search);
    const isRecoveryLink = hash.get("type") === "recovery" || search.get("type") === "recovery" || pending;

    async function prepareRecoverySession() {
      if (!isRecoveryLink) return;
      setCheckingRecovery(true);
      setMessage("Проверяем ссылку восстановления…");

      let session = (await auth.getSession()).data.session;
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      const code = search.get("code");

      if (!session && accessToken && refreshToken) {
        const result = await auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        session = result.data.session;
      }

      if (!session && code) {
        const result = await auth.exchangeCodeForSession(code);
        session = result.data.session;
      }

      if (!active) return;
      setCheckingRecovery(false);
      if (session) {
        setRecoveryMode(true);
        setMessage("");
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        setRecoveryMode(false);
        window.localStorage.removeItem("exclusive-password-recovery");
        setMessage("Ссылка восстановления недействительна или устарела. Запросите новое письмо.");
      }
    }

    void prepareRecoverySession();

    const { data } = auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setCheckingRecovery(false);
        setRecoveryMode(true);
        setMessage("");
      }
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

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
    if (error) setMessage(loginError(error.message));
    else router.push(`/${locale}/account`);
    setSubmitting(false);
  }

  async function forgotPassword() {
    if (!email.trim()) {
      setMessage("Сначала введите email, на который зарегистрирован аккаунт.");
      return;
    }
    setSubmitting(true);
    setMessage("");
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const redirectTo = `${window.location.origin}${basePath}/${locale}/login/`;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
    if (error) setMessage(error.message);
    else {
      window.localStorage.setItem("exclusive-password-recovery", "pending");
      setMessage("Письмо для восстановления отправлено. Откройте ссылку из письма в этом браузере.");
    }
    setSubmitting(false);
  }

  async function saveNewPassword(event: FormEvent) {
    event.preventDefault();
    if (newPassword.length < 8) {
      setMessage("Новый пароль должен содержать не менее 8 символов.");
      return;
    }
    setSubmitting(true);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setMessage(error.message);
    else {
      window.localStorage.removeItem("exclusive-password-recovery");
      setMessage("Пароль изменён. Открываем профиль…");
      setRecoveryMode(false);
      router.push(`/${locale}/account`);
    }
    setSubmitting(false);
  }

  if (checkingRecovery) {
    return <p className="text-lg" role="status">Проверяем ссылку восстановления…</p>;
  }

  if (recoveryMode) {
    return (
      <form className="flex flex-col gap-8" onSubmit={saveNewPassword}>
        <h2 className="text-2xl font-semibold">Установите новый пароль</h2>
        <InputWithLine props={{ type: "password", placeholder: "Новый пароль — минимум 8 символов", required: true, minLength: 8, value: newPassword, onChange: (e) => setNewPassword(e.target.value) }} />
        <PrimaryButton buttonProps={{ type: "submit", disabled: submitting }}>{submitting ? "Сохраняем…" : "Сохранить новый пароль"}</PrimaryButton>
        {message && <p className="text-sm text-color-button-1" role="status">{message}</p>}
      </form>
    );
  }

  return (
    <form className="flex flex-col gap-14 max-lg:gap-8" onSubmit={submit}>
      <div className="flex flex-col gap-12 max-lg:gap-8">
        <InputWithLine props={{ type: "email", placeholder: dict.pages.registration.login.emailOrPhone, required: true, value: email, onChange: (e) => setEmail(e.target.value) }} />
        <InputWithLine props={{ type: "password", placeholder: dict.pages.registration.login.password, required: true, value: password, onChange: (e) => setPassword(e.target.value) }} />
      </div>
      <div className="flex items-center justify-between gap-5 max-sm:flex-col max-sm:items-stretch">
        <PrimaryButton buttonProps={{ type: "submit", disabled: submitting }}>{submitting ? "Входим…" : dict.pages.registration.login.login}</PrimaryButton>
        <button type="button" onClick={forgotPassword} disabled={submitting} className="text-color-button-1 text-lg capitalize disabled:opacity-50 max-2xl:text-base">{dict.pages.registration.login.forgetPassword}</button>
      </div>
      {message && <p className="text-sm text-color-button-1" role="status">{message}</p>}
      <p className="text-center text-sm text-neutral-600">
        Нет аккаунта?{" "}
        <Link href={`/${locale}/sign-up`} className="font-semibold text-color-button-1 underline underline-offset-4">
          Зарегистрироваться
        </Link>
      </p>
    </form>
  );
}
