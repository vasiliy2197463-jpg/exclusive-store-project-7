"use client";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import CheckOutCard from "@/components/cards/check_out";
import DefaultText from "@/components/titles/DefaultText";
import {
  checkoutProductsState,
  credentialsState,
  deliveryPriceState,
  subTotalPriceState,
} from "@/shared/recoil_states/atoms";
import { IDict, TPrice } from "@/shared/types";
import { Radio, RadioGroup } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function TotalSection({ dict }: IDict) {
  const products = useRecoilValue(checkoutProductsState);
  const credentials = useRecoilValue(credentialsState);
  const router = useRouter();
  const subTotal = useRecoilValue(subTotalPriceState);
  const deliveryPrice = useRecoilValue(deliveryPriceState);
  const [price, setPrice] = useState<TPrice>({
    deliveryPrice: 0,
    subTotal: 0,
    total: 0,
  });
  const [paymentVariation, setPaymentVariation] = useState("bank");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setPrice({
      deliveryPrice,
      subTotal,
      total: subTotal + deliveryPrice,
    });
  }, [deliveryPrice, subTotal]);

  async function placeOrder() {
    setNotice("");
    if (!credentials.firstName || !credentials.streetAddress || !credentials.city || !credentials.phoneNumber || !credentials.email) {
      setNotice("Заполните обязательные поля покупателя.");
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setNotice("Сервис заказов пока не подключён.");
      return;
    }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      setNotice("Войдите или зарегистрируйтесь перед оформлением заказа.");
      return;
    }
    const address = [credentials.streetAddress, credentials.apartment, credentials.city].filter(Boolean).join(", ");
    const { data: order, error } = await supabase.from("orders").insert({
      user_id: user.id,
      total: price.total,
      customer_name: credentials.firstName,
      customer_email: credentials.email,
      customer_phone: credentials.phoneNumber,
      shipping_address: address,
    }).select("id").single();
    if (error || !order) {
      setSaving(false);
      setNotice(error?.message || "Не удалось создать заказ.");
      return;
    }
    const { error: itemError } = await supabase.from("order_items").insert(products.map((product) => ({
      order_id: order.id,
      product_name: product.name,
      unit_price: product.price,
      quantity: 1,
      subtotal: product.price,
    })));
    setSaving(false);
    if (itemError) {
      setNotice(`Заказ создан, но состав не сохранён: ${itemError.message}`);
      return;
    }
    setNotice(`Заказ №${order.id.slice(0, 8)} принят. Оплата при получении.`);
  }

  if (products.length === 0) {
    return (
      <p className="text-4xl self-center max-2xl:text-2xl">
        Nothing to show{" "}
        <span
          className="cursor-pointer text-color-secondary-2"
          onClick={() => router.back()}
        >
          go back
        </span>
      </p>
    );
  }

  return (
    <section className="flex flex-col flex-[0_0_35%] max-3xl:flex-[0_0_40%] max-2xl:flex-[0_0_45%]">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-5 max-3xl:gap-7">
          {products.map((item, i) => (
            <CheckOutCard key={i} {...item} />
          ))}
        </div>
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-color-divider pb-2">
            <DefaultText
              text={dict.pages.cart.checkOut.priceSection.subtotal}
            />
            <DefaultText text={`$${price.subTotal}`} />
          </div>
          <div className="flex items-center justify-between border-b border-color-divider pb-2">
            <DefaultText
              text={dict.pages.cart.checkOut.priceSection.shipping}
            />
            <DefaultText
              text={`${
                price.deliveryPrice === 0 ? "Free" : `$${price.deliveryPrice}`
              }`}
            />
          </div>
          <div className="flex items-center justify-between pb-2">
            <DefaultText text={dict.pages.cart.checkOut.priceSection.total} />
            <DefaultText text={`$${price.total}`} />
          </div>
        </div>
        <RadioGroup
          value={paymentVariation}
          onChange={(e) => setPaymentVariation(e)}
          className="flex flex-col gap-5"
        >
          <div className="flex items-center justify-between">
            <Radio colorScheme="red" className="text-lg" value="bank">
              {dict.pages.cart.checkOut.priceSection.payment.bank}
            </Radio>
            <div className="flex items-center gap-2">
              {new Array(4).fill(0).map((_, i) => (
                <Image
                  alt="card"
                  src={`/images/check_out/credit-card-${i}.webp`}
                  width={100}
                  height={100}
                  key={i}
                  className="w-8 object-contain"
                />
              ))}
            </div>
          </div>
          <Radio colorScheme="red" className="text-lg" value="onDelivery">
            {dict.pages.cart.checkOut.priceSection.payment.cash}
          </Radio>
        </RadioGroup>
        <div className="flex gap-5">
          <input
            type="text"
            placeholder={
              dict.pages.cart.checkOut.priceSection.coupon.placeholder
            }
            className="p-4 w-80 text-base rounded-sm border-color-bg-1 border duration-300 transition-colors focus-within:outline-color-bg-1
            max-3xl:p-3 max-2xl:text-sm"
          />
          <PrimaryButton>
            {dict.pages.cart.checkOut.priceSection.coupon.apply}
          </PrimaryButton>
        </div>
        {notice && <p className="max-w-xl rounded-lg bg-neutral-100 p-4 text-sm" role="status">{notice}</p>}
        <PrimaryButton className="self-start" buttonProps={{ onClick: placeOrder, disabled: saving }}>
          {saving ? "Оформляем…" : dict.pages.cart.checkOut.priceSection.order}
        </PrimaryButton>
      </div>
    </section>
  );
}
