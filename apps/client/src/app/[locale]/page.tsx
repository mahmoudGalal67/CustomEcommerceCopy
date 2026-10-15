import ProductList from "@/components/ProductList";
import { Newsletter } from "@/components/Newsletter";
import { getDictionary } from "@/i18n/config";
import { Suspense } from "react";
import HomeSections from "@/components/HomeSections";

const Homepage = async ({
  searchParams,
  params,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { locale } = await params;
  const queryParams = await searchParams;
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
      >
        <ProductList
          query={queryParams}
          params="homepage"
          locale={locale}
          dict={dict}
        />
      </Suspense>
      <Newsletter />
    </div>
  );
};

export default Homepage;
