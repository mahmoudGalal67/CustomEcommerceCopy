import { z } from "zod";

export const paymentMethodSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Payment method name is required"),
  number: z.string().min(4, "Payment number is required"),
});

export const settingsSchema = z.object({
  website_name: z.string().min(2, "Website name is required"),

  show_contact_page: z.boolean(),
  show_about_page: z.boolean(),
  show_terms_page: z.boolean(),
  show_privacy_page: z.boolean(),

  email_notifications: z.boolean(),

  languages: z.array(z.string()).min(1, "Select at least one language"),

  currency: z.enum(["USD", "EUR", "EGP", "SAR"]),

  footer_font_size: z
    .number()
    .min(10, "Font size must be at least 10")
    .max(40, "Font size must be at most 40"),

  background_image: z.string().nullable().optional(),
  store_logo: z.string().nullable().optional(),
  favicon: z.string().nullable().optional(),

  show_featured_products: z.boolean(),
  show_best_sellers: z.boolean(),
  show_new_arrivals: z.boolean(),

  payment_methods: z.array(paymentMethodSchema),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
