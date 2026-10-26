import Link from "next/link";

import { productsAPi } from "../utilis/api";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import SimpleProductCard from "./SimpleProductCard";

const AllProductList = async ({
  locale,
  dict,
}: {
  locale: string;
  dict: any;
}) => {
  const allproductsResponse = await productsAPi.getAllProducts();

  const products = allproductsResponse.data;
  console.log("all products", products);
  return (
    <div className="w-full">
      {/* heading */}
      <div className="flex flex-col items-start justify-between gap-6 my-16 sm:flex-row sm:items-end">
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            {locale == "ar" ? "المجموعة" : "The Collection"}
          </p>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {locale == "ar" ? "أحذية رياضية جديدة،" : "  Fresh Kicks,"}

            <br />
            <span className="text-muted-foreground">
              {locale == "ar" ? "مختارات أسبوعية" : " Curated Weekly."}
            </span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            {locale == "ar"
              ? "تشكيلة مختارة بعناية من أحدث وأروع الإصدارات للعلامات التجارية التي تعشقها؛ حيث تخضع كل قطعة للتحقق من أصالتها، ويتم التأكد من دقة أسعارها."
              : "Hand-picked heat from every brand you love. Every pair is authenticated, every price is checked."}
          </p>
        </div>
        <Button
          variant="outline"
          className="group gap-1 rounded-full border-border/60 hover:border-primary/50"
        >
          <Link
            href={`${locale}/products`}
            className="px-7 py-3 text-base font-semibold"
          >
            {dict.Buttons.showAllProducts}
          </Link>
          <ArrowRight
            className={` h-4 w-4 transition-transform group-hover:translate-x-1 ${locale === "ar" ? "rotate-180" : ""}`}
          />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
        {products?.data.map((product: any) => (
          <SimpleProductCard
            key={product.id}
            product={product}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
};

export default AllProductList;
