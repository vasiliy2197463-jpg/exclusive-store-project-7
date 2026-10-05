"use client";
import { poppinsMediumFont } from "fonts";
import OutlinedButton from "@/components/buttons/OutlinedButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import InputWithLine from "@/components/inputs/InputWithLine";
import Image from "next/image";
import Link from "next/link";
import { useFormik } from "formik";
import { ICredentials, IDict } from "@/shared/types";
import { useRecoilState } from "recoil";
import { credentialsState } from "@/shared/recoil_states/atoms";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignUpForm({ dict }: IDict) {
  const [credentials, setCredentials] = useRecoilState(credentialsState);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const formik = useFormik<ICredentials>({
    initialValues: {
      ...credentials,
    },
    onSubmit: async ({ firstName, email, password, phoneNumber }) => {
      setSubmitting(true);
      setMessage("");
      setCredentials({
        ...credentials,
        firstName,
        phoneNumber,
        password,
        email,
      });
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        setMessage("Supabase ещё не подключён. Добавьте ключи проекта в .env.local");
        setSubmitting(false);
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: firstName, phone: phoneNumber },
          emailRedirectTo: `https://vasiliy2197463-jpg.github.io/exclusive-store-project-7/${locale}/account/`,
        },
      });
      if (error) {
        setMessage(error.message.toLowerCase().includes("already registered") ? "Этот email уже зарегистрирован. Перейдите ко входу или восстановите пароль." : error.message);
      } else if (data.session) {
        setMessage("Аккаунт создан. Выполняется вход…");
        router.push(`/${locale}/account`);
      } else {
        setMessage("Аккаунт создан. Проверьте почту для подтверждения.");
      }
      setSubmitting(false);
    },
  });

  const locale = usePathname().split("/")[1];

  async function signUpWithGoogle() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Supabase ещё не подключён");
      return;
    }
    setMessage("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `https://vasiliy2197463-jpg.github.io/exclusive-store-project-7/${locale}/account/`,
      },
    });
    if (error) setMessage(error.message);
  }

  return (
    <form
      className="flex min-w-0 flex-col gap-14 max-2xl:gap-8 max-sm:gap-6"
      onSubmit={formik.handleSubmit}
    >
      <div className="flex flex-col gap-12 max-2xl:gap-8">
        <InputWithLine
          props={{
            type: "text",
            placeholder: dict.pages.registration.signUp.inputs.name,
            required: true,
            value: formik.values.firstName,
            onChange: formik.handleChange,
            id: "firstName",
            name: "firstName",
            autoComplete: "name",
            enterKeyHint: "next",
          }}
        />
        <InputWithLine
          props={{
            type: "email",
            placeholder: dict.pages.registration.signUp.inputs.email,
            required: true,
            value: formik.values.email,
            onChange: formik.handleChange,
            id: "email",
            name: "email",
            autoComplete: "email",
            inputMode: "email",
            enterKeyHint: "next",
          }}
        />
        <InputWithLine
          props={{
            type: "tel",
            placeholder: dict.pages.registration.signUp.inputs.phoneNumber,
            required: true,
            value: formik.values.phoneNumber,
            onChange: formik.handleChange,
            id: "phoneNumber",
            name: "phoneNumber",
            autoComplete: "tel",
            inputMode: "tel",
            enterKeyHint: "next",
          }}
        />
        <InputWithLine
          props={{
            type: "password",
            placeholder: dict.pages.registration.signUp.inputs.password,
            required: true,
            value: formik.values.password,
            onChange: formik.handleChange,
            id: "password",
            name: "password",
            autoComplete: "new-password",
            enterKeyHint: "done",
            minLength: 8,
          }}
        />
      </div>
      <div className="flex flex-col gap-5">
        <PrimaryButton
          buttonProps={{
            type: "submit",
            disabled: submitting,
          }}
        >
          {submitting ? "Создаём аккаунт…" : dict.pages.registration.signUp.createAcc}
        </PrimaryButton>
        <OutlinedButton
          buttonProps={{ type: "button", onClick: signUpWithGoogle }}
          className="flex min-w-0 items-center justify-center gap-5 px-5"
        >
          <Image
            alt=""
            src={"/icons/sign_up/google.svg"}
            width={100}
            height={100}
            className="w-7 h-7 max-2xl:w-6 max-2xl:h-6"
          />
          <span className="text-center text-base max-sm:text-sm">
            {dict.pages.registration.signUp.signGoogle}
          </span>
        </OutlinedButton>
      </div>
      {message && <p className="text-sm text-color-button-1" role="status">{message}</p>}
      <div className="flex flex-wrap items-center justify-center gap-4 text-color-text-2 text-lg">
        <p className="text-base max-2xl:text-sm">
          {dict.pages.registration.signUp.haveAccount}
        </p>
        <Link
          href={`/${locale}/login`}
          className={`${poppinsMediumFont.className} duration-300 ease-in-out transition-colors underline underline-offset-8 hover:text-color-text-2-hover text-base
          max-2xl:text-sm`}
        >
          {dict.pages.registration.signUp.login}
        </Link>
      </div>
    </form>
  );
}
