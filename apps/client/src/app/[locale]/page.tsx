import AllProductList from "@/components/AllProductList";
import HomeSections from "@/components/HomeSections";
import { Newsletter } from "@/components/Newsletter";
import ProductList from "@/components/ProductList";
import { getDictionary } from "@/i18n/config";
import { Suspense } from "react";

const Homepage = async ({
  params,
}: {
  params: Promise<{
    locale: string;
  }>;
}) => {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return (
    <div className="">
      <HomeSections />
      <Suspense
        fallback={
          <section
            aria-label="Loading products"
            aria-busy="true"
            className="w-full py-12"
          >
            <div className="mb-8 h-8 w-48 animate-pulse rounded bg-muted" />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="h-80 animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          </section>
        }
      ></Suspense>
      <AllProductList locale={locale} dict={dict} />
      <Newsletter />
    </div>
  );
};

export default Homepage;
