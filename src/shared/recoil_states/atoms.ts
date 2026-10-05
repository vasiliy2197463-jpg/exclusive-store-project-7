import { atom } from "recoil";
import {
  ICartProductCard,
  ICheckoutCard,
  ICredentials,
  IProductCard,
} from "../types";
import { calculateDeliveryPrice, calculateSubtotal } from "../utils";

function readArray<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

// ! favorites
export const favoriteProductsState = atom<IProductCard[]>({
  key: "FavoriteProducts",
  default: [],
  effects: [
    ({ onSet, setSelf }) => {
      onSet((param) => {
        localStorage.setItem("favorite-products", JSON.stringify(param));
      });
      setSelf(() => {
        return readArray<IProductCard>("favorite-products");
      });
    },
  ],
});

// ! cart
export const cartProductsState = atom<ICartProductCard[]>({
  key: "CartProducts",
  default: [],
  effects: [
    ({ onSet, setSelf }) => {
      onSet((param) => {
        localStorage.setItem("cart-products", JSON.stringify(param));
      });
      setSelf(() => {
        return readArray<ICartProductCard>("cart-products");
      });
    },
  ],
});

// ! subtotal price
export const subTotalPriceState = atom<number>({
  key: "SubTotalPrice",
  default: 0,
  effects: [
    ({ setSelf }) => {
      setSelf((state) => {
        const cartArray = readArray<ICartProductCard>("cart-products");
        return calculateSubtotal(cartArray, state as number);
      });
    },
  ],
});

// ! delivery price
export const deliveryPriceState = atom<number>({
  key: "DeliveryPrice",
  default: 100,
  effects: [
    ({ setSelf }) => {
      setSelf((state) => {
        const cartArray = readArray<ICartProductCard>("cart-products");
        return calculateDeliveryPrice(cartArray, state as number);
      });
    },
  ],
});

// ! checkout products to sell
export const checkoutProductsState = atom<ICheckoutCard[]>({
  key: "CheckoutProducts",
  default: [],
  effects: [
    ({ setSelf }) => {
      setSelf(() => []);
    },
  ],
});

// ! credentials of user
const defaultCredentials: ICredentials = {
  phoneNumber: "",
  email: "",
  firstName: "",
  companyName: "",
  apartment: "",
  city: "",
  streetAddress: "",
  password: "",
};
export const credentialsState = atom<ICredentials>({
  key: "Credentials",
  default: { ...defaultCredentials },
  effects: [
    ({ onSet, setSelf }) => {
      onSet((param) => {
        localStorage.setItem("credentials", JSON.stringify(param));
      });
      setSelf(() => {
        let returnValue: ICredentials;

        if (typeof window !== "undefined" && localStorage) {
          returnValue =
            localStorage.getItem("credentials") !== null
              ? JSON.parse(localStorage.getItem("credentials") as string)
              : defaultCredentials;
        } else {
          returnValue = defaultCredentials;
        }
        return returnValue;
      });
    },
  ],
});
