import ProductList from "@/components/ProductList";
import { Newsletter } from "@/components/Newsletter";
import { getDictionary } from "@/i18n/config";

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
      <ProductList
        query={queryParams}
        params="homepage"
        locale={locale}
        dict={dict}
      />
      <Newsletter />
    </div>
  );
};

export default Homepage;
