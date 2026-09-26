"use client";
import { categoryType } from "@/types/types";
import { Hand } from "lucide-react";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

const Categories = ({ categories }: { categories: categoryType[] }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = (params.locale || "en") as string;

  const selectedCategory = searchParams.get("category");

  const handleChange = (value: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", value || "all");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="grid grid-cols-2 mt-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 bg-primary p-2 rounded-lg mb-4 text-sm">
      <div
        key="all"
        className={`flex items-center justify-center gap-2 cursor-pointer px-2 py-1 rounded-md text-white border-popover border ${
          "all" === selectedCategory ? "bg-muted-foreground " : ""
        }`}
        onClick={() => handleChange("all")}
      >
        <Hand className="w-4 h-4" />

        {/* use translated name instead of fallback */}
        {locale == "ar" ? "الكل" : "all"}
      </div>
      {categories.map((category) => {
        const translation = category.translations.find(
          (t) => t.locale === locale,
        );

        return (
          <>
            <div
              key={category.id}
              className={`flex items-center justify-center gap-2 cursor-pointer px-2 py-1 rounded-md text-white border-popover border ${
                translation?.name === selectedCategory
                  ? "bg-muted-foreground "
                  : ""
              }`}
              onClick={() => handleChange(translation?.name)}
            >
              {category.icon ? (
                <Image
                  className="w-4 h-4"
                  width={20}
                  height={20}
                  src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${category.icon}`}
                  alt=""
                />
              ) : (
                <Hand className="w-4 h-4" />
              )}

              {/* use translated name instead of fallback */}
              {translation?.name}
            </div>
          </>
        );
      })}
    </div>
  );
};
export default Categories;
