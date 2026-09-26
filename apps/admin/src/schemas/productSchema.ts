import { z } from "zod";

// ✅ Variant schema
export const variantSchema = z
  .object({
    id: z.coerce.string().optional() || null,

    price: z.string().min(1, "Price is required"),
    stock: z.string().min(1, "Stock is required"),
    color_id: z.string().min(1, "Color is required"),
    size_id: z.string().min(1, "Size is required"),
    sku: z.string().optional(),

    deleted_images: z.array(z.string()).optional(),

    images_all: z.array(z.any()),
  })
  .refine(
    (data) => {
      const newCount = data.images_all?.length ?? 0;
      return newCount > 0;
    },
    {
      message: "At least one image is required",
      path: ["images_all"],
    },
  );

// ✅ Product schema
export const productSchema = z
  .object({
    name: z.string().min(2, "Product name required"),
    nameAR: z.string().min(2, "Product name required"),
    description: z
      .string()
      .min(5, "Description required with at least 5 characters"),
    descriptionAR: z
      .string()
      .min(5, "Description required with at least 5 characters"),
    base_price: z.string().optional(),
    stock: z.string().optional(),
    category_id: z.string().min(1, "Category required"),
    base_images: z.array(z.instanceof(File)).optional(),
    variants: z.array(variantSchema).optional(),
    existing_base_images: z.any(),
    deleted_base_images: z.any(),
  })
  .refine(
    (data) => {
      if (!data.variants || data.variants.length === 0) {
        return !!data.base_price;
      }
      return true;
    },
    {
      message: "Base price is required when no variants exist",
      path: ["base_price"],
    },
  )
  .refine(
    (data) => {
      if (!data.variants || data.variants.length === 0) {
        return !!data.stock;
      }
      return true;
    },
    {
      message: "stock is required when no variants exist",
      path: ["stock"],
    },
  )
  .refine(
    (data) => {
      if (!data.variants || data.variants.length === 0) {
        const existing = data.existing_base_images?.length ?? 0;
        const newImages = data.base_images?.length ?? 0;
        return existing + newImages > 0;
      }
      return true;
    },
    {
      message: "At least one base image is required",
      path: ["base_images"],
    },
  );

export type ProductForm = z.infer<typeof productSchema>;
