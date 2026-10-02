"use client";

import InputWithLabel from "@/components/inputs/InputWithLabel";
import { credentialsState } from "@/shared/recoil_states/atoms";
import { ICredentials, IDict } from "@/shared/types";
import { interMediumFont } from "fonts";
import { useFormik } from "formik";
import { useRecoilState } from "recoil";
import { validate } from "./validation";
import { Checkbox } from "@chakra-ui/react";
import { twMerge as tw } from "tailwind-merge";

export default function FormSection({ dict }: IDict) {
  const [credentials, setCredentials] = useRecoilState(credentialsState);
  const formik = useFormik<ICredentials>({
    initialValues: {
      ...credentials,
    },
    onSubmit: (values) => {},
    validate,
  });

  return (
    <section className="gap-8 flex flex-col flex-[0_0_30%] max-3xl:flex-[0_0_35%] max-2xl:flex-[0_0_30%]">
      <h1
        className={tw(
          "text-[40px] max-3xl:text-4xl max-2xl:text-2xl",
          interMediumFont.className
        )}
      >
        {dict.pages.cart.checkOut.form.title}
      </h1>
      <div className="space-y-2">
        <form className="space-y-3" onSubmit={formik.handleSubmit}>
          <InputWithLabel
            label={dict.pages.cart.checkOut.form.firstName}
            labelSpan="*"
            error={formik.errors.firstName}
            inputProps={{
              type: "text",
              required: true,
              value: formik.values.firstName,
              onChange: (event) => { formik.handleChange(event); setCredentials((value) => ({ ...value, firstName: event.target.value })); },
              id: "firstName",
            }}
          />
          <InputWithLabel
            label={dict.pages.cart.checkOut.form.companyName}
            error={formik.errors.companyName}
            inputProps={{
              type: "text",
              value: formik.values.companyName,
              onChange: (event) => { formik.handleChange(event); setCredentials((value) => ({ ...value, companyName: event.target.value })); },
              id: "companyName",
            }}
          />
          <InputWithLabel
            label={dict.pages.cart.checkOut.form.streetAddress}
            labelSpan="*"
            error={formik.errors.streetAddress}
            inputProps={{
              type: "text",
              required: true,
              value: formik.values.streetAddress,
              onChange: (event) => { formik.handleChange(event); setCredentials((value) => ({ ...value, streetAddress: event.target.value })); },
              id: "streetAddress",
            }}
          />
          <InputWithLabel
            label={dict.pages.cart.checkOut.form.apartment}
            error={formik.errors.apartment}
            inputProps={{
              type: "text",
              value: formik.values.apartment,
              onChange: (event) => { formik.handleChange(event); setCredentials((value) => ({ ...value, apartment: event.target.value })); },
              id: "apartment",
            }}
          />
          <InputWithLabel
            label={dict.pages.cart.checkOut.form.city}
            labelSpan="*"
            error={formik.errors.city}
            inputProps={{
              type: "text",
              required: true,
              value: formik.values.city,
              onChange: (event) => { formik.handleChange(event); setCredentials((value) => ({ ...value, city: event.target.value })); },
              id: "city",
            }}
          />
          <InputWithLabel
            label={dict.pages.cart.checkOut.form.phoneNumber}
            labelSpan="*"
            error={formik.errors.phoneNumber}
            inputProps={{
              type: "text",
              required: true,
              value: formik.values.phoneNumber,
              onChange: (event) => { formik.handleChange(event); setCredentials((value) => ({ ...value, phoneNumber: event.target.value })); },
              id: "phoneNumber",
            }}
          />
          <InputWithLabel
            label={dict.pages.cart.checkOut.form.email}
            labelSpan="*"
            error={formik.errors.email}
            inputProps={{
              type: "text",
              required: true,
              value: formik.values.email,
              onChange: (event) => { formik.handleChange(event); setCredentials((value) => ({ ...value, email: event.target.value })); },
              id: "email",
            }}
          />
        </form>
        <Checkbox colorScheme="red">
          {dict.pages.cart.checkOut.form.checkbox}
        </Checkbox>
      </div>
    </section>
  );
}
