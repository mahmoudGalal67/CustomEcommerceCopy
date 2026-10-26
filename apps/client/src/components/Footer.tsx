// src/components/Footer.tsx
import Image from "next/image";
import Link from "next/link";

type LocalizedText = {
  en?: string;
  ar?: string;
};

type SocialLink = {
  name: string;
  link: string;
  logo?: string | null;
};

type PageLink = {
  id: number;
  title: LocalizedText | string;
};

type FooterSettings = {
  logo?: string | null;
  site_name?: string;
  socials?: SocialLink[];
  info?: {
    about?: {
      rights?: LocalizedText | string | null;
      footerDescription?: LocalizedText | string | null;
    };
  };
};

type FooterFeatures = {
  show_contact_page?: boolean;
  show_about_page?: boolean;
  show_terms_page?: boolean;
  show_privacy_page?: boolean;
};

type FooterProps = {
  locale: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

async function fetchApi<T>(endpoint: string): Promise<T | null> {
  if (!API_URL) {
    console.error("NEXT_PUBLIC_API_URL is not configured.");
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error(
        `Footer API request failed: ${endpoint} (${response.status})`,
      );
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`Failed to fetch Footer data: ${endpoint}`, error);
    return null;
  }
}

function getLocalizedText(
  value: LocalizedText | string | null | undefined,
  locale: string,
): string {
  if (!value) return "";
  if (typeof value === "string") return value;

  if (locale === "ar") {
    return value.ar || value.en || "";
  }

  return value.en || value.ar || "";
}

export default async function Footer({ locale }: FooterProps) {
  const [settings, pagesLinks, features] = await Promise.all([
    fetchApi<FooterSettings>("/settings"),
    fetchApi<PageLink[]>("/pages/pagesLinks"),
    fetchApi<FooterFeatures>("/features"),
  ]);

  const logoUrl = settings?.logo ? `${API_URL}/storage/${settings.logo}` : null;

  return (
    <footer className="mt-16 rounded-lg bg-gray-800 p-8">
      <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-between">
        {/* Store information */}
        <div className="flex flex-col items-center gap-4 md:items-start">
          <Link href="/" className="flex items-center gap-2">
            {logoUrl && (
              <Image
                src={logoUrl}
                alt={settings?.site_name || "Logo"}
                width={36}
                height={36}
                className="rounded-md object-contain"
              />
            )}

            <p className="hidden text-md font-medium tracking-wider text-white md:block">
              {settings?.site_name}
            </p>
          </Link>

          <p
            className={`text-sm text-gray-400 ${
              locale === "ar" ? "text-left" : "text-right"
            }`}
            dangerouslySetInnerHTML={{
              __html: getLocalizedText(settings?.info?.about?.rights, locale),
            }}
          />

          <p
            className="text-sm text-gray-400"
            dangerouslySetInnerHTML={{
              __html: getLocalizedText(
                settings?.info?.about?.footerDescription,
                locale,
              ),
            }}
          />

          {settings?.socials && settings.socials.length > 0 && (
            <div className="mt-2 flex items-center gap-3">
              {settings.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 bg-gray-900/50 transition-all duration-300 hover:-translate-y-1 hover:border-gray-500 hover:bg-gray-700 hover:shadow-lg"
                >
                  {social.logo ? (
                    <Image
                      src={`${API_URL}/storage/${social.logo}`}
                      alt={social.name}
                      width={20}
                      height={20}
                      className="object-contain opacity-70 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-gray-400">
                      {social.name?.charAt(0)}
                    </span>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Links */}
        <div className="flex flex-col items-center gap-4 text-sm text-gray-400 md:items-start">
          <p className="text-sm font-medium text-amber-50">
            {locale === "ar" ? "الروابط" : "Links"}
          </p>

          <Link
            href={`/${locale}/`}
            className="transition-colors hover:text-white"
          >
            {locale === "ar" ? "الصفحة الرئيسية" : "Homepage"}
          </Link>

          {features?.show_contact_page && (
            <Link
              href={`/${locale}/contactUs`}
              className="transition-colors hover:text-white"
            >
              {locale === "ar" ? "تواصل معنا" : "Contact"}
            </Link>
          )}

          <Link
            href={`/${locale}/products`}
            className="transition-colors hover:text-white"
          >
            {locale === "ar" ? "المنتجات" : "products"}
          </Link>

          <Link
            href={`/${locale}/cart`}
            className="transition-colors hover:text-white"
          >
            {locale === "ar" ? "عربة التسوق" : "cart"}
          </Link>
        </div>

        {/* Dynamic pages */}
        <div className="flex flex-col items-center gap-4 text-sm text-gray-400 md:items-start">
          <p className="text-sm font-medium text-amber-50">
            {locale === "ar" ? "الصفحات" : "Pages"}
          </p>

          {pagesLinks?.map((link) => (
            <Link
              key={link.id}
              href={`/${locale}/pages/${link.id}`}
              className="transition-colors hover:text-white"
            >
              {getLocalizedText(link.title, locale)}
            </Link>
          ))}
        </div>

        {/* Company */}
        <div className="flex flex-col items-center gap-4 text-sm text-gray-400 md:items-start">
          <p className="text-sm font-medium text-amber-50">
            {locale === "ar" ? "الشركة" : "Company"}
          </p>

          {features?.show_about_page && (
            <Link
              href={`/${locale}/about`}
              className="transition-colors hover:text-white"
            >
              {locale === "ar" ? "من نحن " : "About"}
            </Link>
          )}

          {features?.show_terms_page && (
            <Link
              href={`/${locale}/terms`}
              className="transition-colors hover:text-white"
            >
              {locale === "ar" ? "الشروط والأحكام" : "terms&conditions "}
            </Link>
          )}

          {features?.show_privacy_page && (
            <Link
              href={`/${locale}/privacy`}
              className="transition-colors hover:text-white"
            >
              {locale === "ar" ? "سياسة الخصوصية" : " Privacy Policy "}
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
