import { z } from "zod";

export const paymentMethodSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Payment method name is required"),

  number: z.string().min(4, "Payment number is required"),
});

export const settingsSchema = z.object({
  website_name: z.string().min(2, "Website name is required"),

  show_contact_page: z.boolean().optional(),
  show_about_page: z.boolean().optional(),
  show_terms_page: z.boolean().optional(),
  show_privacy_page: z.boolean().optional(),

  default_shipping_address: z.string().optional(),

  default_billing_address: z.string().optional(),

  address_label: z.string(),

  email_notifications: z.boolean(),

  languages: z.array(z.string()).min(1, "Select at least one language"),

  currency: z.enum(["USD", "EUR", "EGP", "SAR"]),

  preferred_delivery_time: z.string(),

  leave_at_door: z.boolean(),

  signature_required: z.boolean(),

  contact_email: z.string().email("Invalid email"),

  contact_phone: z.string("Website phone is required"),

  contact_whatsapp: z.string(),

  coupon_code: z.string(),

  footer_font_size: z.number().min(10).max(40),

  background_image: z.string().optional(),

  store_logo: z.string().optional(),

  favicon: z.string().optional(),

  seo_title: z.string(),

  seo_description: z.string(),

  seo_keywords: z.string(),

  show_featured_products: z.boolean(),

  show_best_sellers: z.boolean(),

  show_new_arrivals: z.boolean(),

  payment_methods: z.array(paymentMethodSchema),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
