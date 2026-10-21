import Image from "next/image";
import Link from "next/link";
import { SimpleProductType } from "@/types/types";

const SimpleProductCard = ({
  product,
  locale,
}: {
  product: SimpleProductType;
  locale: any;
}) => {
  const translation = product.translations.find((t) => t.locale === locale);
  return (
    <div
      className="
        group
        flex flex-col
        overflow-hidden
        rounded-lg
        shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15)]
        dark:border
        dark:border-gray-800
        dark:shadow-[0_10px_25px_-5px_rgba(255,255,255,0.08)]
      "
    >
      {/* ================================================================ */}
      {/* IMAGE */}
      {/* ================================================================ */}

      <Link href={`/${locale}/products/${product.id}`}>
        <div className="relative aspect-[4/5] overflow-hidden">
          {/* PRODUCT IMAGE */}

          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${product.base_images?.[0]}`}
            alt={translation?.name || product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`
                object-cover
                transition-all
                duration-300
              `}
          />
        </div>
      </Link>

      {/* ================================================================ */}
      {/* PRODUCT DETAIL */}
      {/* ================================================================ */}

      <div className="flex flex-col gap-4 p-4">
        <h2 className="font-medium">{translation?.name || product.name}</h2>

        <p className="line-clamp-2 text-sm text-gray-500">
          {translation?.description}
        </p>

        <div className="flex items-center justify-between">
          <Link
            href={`/${locale}/products/${product.id}`}
            className=" flex items-center gap-2 rounded-md px-3 py-2 text-sm
            ring-1 ring-gray-200 transition-all duration-300 hover:bg-primary
            hover:text-white hover:ring-primary disabled:cursor-not-allowed
            disabled:bg-gray-100 disabled:text-gray-400 disabled:ring-gray-200
            disabled:opacity-70 dark:disabled:bg-gray-800
            dark:disabled:text-gray-500 "
          >
            {locale === "ar" ? "اكتشف  المنتج" : "Discover Product"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SimpleProductCard;
