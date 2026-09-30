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

  email_notifications: boolean;

  languages: string[];
  currency: "USD" | "EUR" | "EGP" | "SAR";

  footer_font_size: number;

  background_image?: string;
  store_logo?: string;
  favicon?: string;

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

  email_notifications: true,

  languages: ["en"],
  currency: "USD",

  footer_font_size: 14,

  background_image: "",
  store_logo: "",
  favicon: "",

  show_featured_products: true,
  show_best_sellers: true,
  show_new_arrivals: true,

  payment_methods: [],
};
