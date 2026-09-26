export interface PaymentMethod {
  id?: string;
  name: string;
  number: string;
}

export interface StoreSettings {
  website_name: string;

  show_contact_page: boolean;
  show_about_page: boolean;
  show_terms_page: boolean;
  show_privacy_page: boolean;

  default_shipping_address?: string;
  default_billing_address?: string;
  address_label: string;

  email_notifications: boolean;

  languages: string[];
  currency: "USD" | "EUR" | "EGP" | "SAR";

  preferred_delivery_time: string;
  leave_at_door: boolean;
  signature_required: boolean;

  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;

  coupon_code: string;

  footer_font_size: number;

  background_image?: string;
  store_logo?: string;
  favicon?: string;

  seo_title: string;
  seo_description: string;
  seo_keywords: string;

  show_featured_products: boolean;
  show_best_sellers: boolean;
  show_new_arrivals: boolean;

  payment_methods: PaymentMethod[];
}

export const defaultSettings: StoreSettings = {
  website_name: "",

  show_contact_page: true,
  show_about_page: true,
  show_terms_page: true,
  show_privacy_page: true,

  default_shipping_address: "",
  default_billing_address: "",
  address_label: "Home",

  email_notifications: true,

  languages: ["en"],
  currency: "USD",

  preferred_delivery_time: "",

  leave_at_door: false,
  signature_required: false,

  contact_email: "",
  contact_phone: "",
  contact_whatsapp: "",

  coupon_code: "",

  footer_font_size: 14,

  background_image: "",
  store_logo: "",
  favicon: "",

  seo_title: "",
  seo_description: "",
  seo_keywords: "",

  show_featured_products: true,
  show_best_sellers: true,
  show_new_arrivals: true,

  payment_methods: [],
};
