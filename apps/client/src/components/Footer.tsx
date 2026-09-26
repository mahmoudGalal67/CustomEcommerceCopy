"use client";

import { useGetFeaturesQuery } from "@/services/features";
import { useGetPageLinksQuery } from "@/services/pagesApi";
import { useGetSettingsQuery } from "@/services/SettingsApi";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const Footer = ({ dict }: { dict: any }) => {
  const { data: settings } = useGetSettingsQuery(undefined);
  const { data: pagesLinks } = useGetPageLinksQuery(undefined);
  const { data: features, isLoading } = useGetFeaturesQuery(undefined);

  const params = useParams();
  const locale = (params.locale || "en") as string;

  const logoUrl = settings?.logo
    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${settings.logo}`
    : null;

  type LocalizedText = {
    en?: string;
    ar?: string;
  };

  console.log(features);
  const getLocalizedText = (
    value: LocalizedText | string | null | undefined,
    locale: string,
  ) => {
    if (!value) return "";

    // Backward compatibility with old string data
    if (typeof value === "string") {
      return value;
    }

    if (locale === "ar") {
      return value.ar || value.en || "";
    }

    return value.en || value.ar || "";
  };
  console.log(settings);
  return (
    <footer className="mt-16 rounded-lg bg-gray-800 p-8">
      <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-between">
        {/* Brand */}
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
          ></p>

          <p
            className="text-sm text-gray-400"
            dangerouslySetInnerHTML={{
              __html: getLocalizedText(
                settings?.info?.about?.footerDescription,
                locale,
              ),
            }}
          />

          {/* Socials */}
          {settings?.socials?.length > 0 && (
            <div className="mt-2 flex items-center gap-3">
              {settings.socials.map((social: any) => (
                <a
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className="
                    group flex h-10 w-10 items-center justify-center
                    rounded-full
                    border border-gray-700
                    bg-gray-900/50
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-gray-500
                    hover:bg-gray-700
                    hover:shadow-lg
                  "
                >
                  {social.logo ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${social.logo}`}
                      alt={social.name}
                      width={20}
                      height={20}
                      className="
                        object-contain
                        opacity-70
                        transition-all duration-300
                        group-hover:scale-110
                        group-hover:opacity-100
                      "
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
            {" "}
            {locale == "ar" ? "الروابط" : "Links"}
          </p>

          <Link
            href={`/${locale}/`}
            className="transition-colors hover:text-white"
          >
            {locale == "ar" ? "الصفحة الرئيسية" : "Homepage"}
          </Link>

          {features?.show_contact_page && (
            <Link
              href={`/${locale}/contactUs`}
              className="transition-colors hover:text-white"
            >
              {locale == "ar" ? "تواصل معنا" : "Contact"}
            </Link>
          )}

          <Link
            href={`/${locale}/products`}
            className="transition-colors hover:text-white"
          >
            {locale == "ar" ? "المنتجات" : "products"}
          </Link>
          <Link
            href={`/${locale}/cart`}
            className="transition-colors hover:text-white"
          >
            {locale == "ar" ? "عربة التسوق" : "cart"}
          </Link>
        </div>

        {/* Products */}
        <div className="flex flex-col items-center gap-4 text-sm text-gray-400 md:items-start">
          <p className="text-sm font-medium text-amber-50">
            {" "}
            {locale == "ar" ? "الصفحات" : "Pages"}
          </p>
          {pagesLinks?.map(
            (link: { title: any; id: number }, index: number) => (
              <Link
                href={`/${locale}/pages/${link.id}`}
                className="transition-colors hover:text-white"
              >
                {getLocalizedText(link.title, locale)}
              </Link>
            ),
          )}
        </div>

        {/* Company */}
        <div className="flex flex-col items-center gap-4 text-sm text-gray-400 md:items-start">
          <p className="text-sm font-medium text-amber-50">
            {" "}
            {locale == "ar" ? "الشركة" : "Company"}
          </p>
          {features?.show_about_page && (
            <Link
              href={`/${locale}/about`}
              className="transition-colors hover:text-white"
            >
              {locale == "ar" ? "من نحن " : "About"}
            </Link>
          )}
          {features?.show_terms_page && (
            <Link
              href={`/${locale}/terms`}
              className="transition-colors hover:text-white"
            >
              {locale == "ar" ? "الشروط والأحكام" : "terms&conditions "}
            </Link>
          )}
          {features?.show_privacy_page && (
            <Link
              href={`/${locale}/privacy`}
              className="transition-colors hover:text-white"
            >
              {locale == "ar" ? "سياسة الخصوصية" : " Privacy Policy "}
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
