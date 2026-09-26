// export type ProductType = {
//   id: number;
//   seller_id: number;
//   name: string;
//   slug: string;
//   description?: string | null;
//   base_price?: string | null; // optional if variants exist
//   is_active: boolean | number;
//   is_featured: boolean | number;
//   deleted_at?: string | null;
//   created_at: string;
//   updated_at: string;
//   categories: Category[];
//   variants?: Variant[]; // optional
// };

// export interface Category {
//   id: number;
//   name: string;
//   description?: string | null;
//   icon?: string | null;
//   slug: string;
//   parent_id?: number | null;
//   created_at?: string | null;
//   updated_at?: string | null;
//   pivot: Pivot;
// }

export interface Pivot {
  product_id: number;
  category_id: number;
}

export interface Variant {
  id: number;
  product_id: number;
  color_id: number;
  size_id: number;
  sku?: string | null;
  stock: number;
  price: string;
  is_active: boolean | number;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
  images: VariantImage[];
}

export interface VariantImage {
  id: number;
  variant_id: number;
  file_path: string;
  is_main: boolean | number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

import { z } from "zod";

// ProductType

export type ProductType = {
  id: string | number;
  seller_id: string | number;
  name: string;
  slug: string;
  description: string;
  base_price?: number;
  stock?: number;
  is_featured: boolean;
  is_active: boolean;
  seller?: {
    id: string | number;
    phone: string;
  };
  base_images?: string[];
  variants: variantType[];
  translations: {
    locale: string;
    name: string;
    description: string;
  }[];
};

export type categoryType = {
  id: number;
  name: string;
  parent_id?: string;
  slug?: string;
  translations: { locale: string; name: string; description: string }[];
  icon?: string;
};

export type variantType = {
  id: string | number;
  product_id: string | number;
  color: { name: string; hex: string };
  size: { name: string; code: string };
  price: string | number;
  stock: string | number;
  images: imageType[];
};
export type imageType = {
  id: string | number;
  variant_id: string | number;
  file_path: string;
};
export type ProductsType = ProductType[];

// VariantsTpes

export type VariantColor = { name: string; hex: string };
export type VariantSize = { name: string; code: string };

export type GroupedVariant = {
  size: VariantSize;
  colors: {
    variant_id: string | number;
    color: VariantColor;
    images: string[];
    price: string | number;
    stock: string | number;
  }[];
};

export type CartItemType = ProductType & {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
};

export type CartItemsType = CartItemType[];

export const shippingFormSchema = z.object({
  name: z.string().min(1, "Name is required!"),
  email: z.email().min(1, "Email is required!"),
  phone: z
    .string()
    .min(7, "Phone number must be between 7 and 10 digits!")
    .max(10, "Phone number must be between 7 and 10 digits!")
    .regex(/^\d+$/, "Phone number must contain only numbers!"),
  address: z.string().min(1, "Address is required!"),
  city: z.string().min(1, "City is required!"),
});

export type ShippingFormInputs = z.infer<typeof shippingFormSchema>;

export const paymentFormSchema = z
  .object({
    paymentMethod: z.enum(["stripe", "visa", "paypal"]),

    cardHolder: z.string().optional(),
    cardNumber: z.string().optional(),
    expirationDate: z.string().optional(),
    cvv: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === "visa") {
      if (!data.cardHolder || data.cardHolder.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["cardHolder"],
          message: "Name on card is required",
        });
      }

      if (
        !data.cardNumber ||
        !/^\d{16}$/.test(data.cardNumber.replace(/\s/g, ""))
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["cardNumber"],
          message: "Invalid card number",
        });
      }

      if (
        !data.expirationDate ||
        !/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expirationDate)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["expirationDate"],
          message: "Invalid expiration date",
        });
      }

      if (!data.cvv || !/^\d{3,4}$/.test(data.cvv)) {
        ctx.addIssue({
          code: "custom",
          path: ["cvv"],
          message: "Invalid CVV",
        });
      }
    }
  });

export type PaymentFormInputs = z.infer<typeof paymentFormSchema>;

export type CartStoreStateType = {
  cart: CartItemsType;
  hasHydrated: boolean;
};

export type CartStoreActionsType = {
  addToCart: (product: CartItemType) => void;
  removeFromCart: (product: CartItemType) => void;
  clearCart: () => void;
};
