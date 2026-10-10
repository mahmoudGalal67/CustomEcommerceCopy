import ProductList from "@/components/ProductList";
import { getDictionary } from "@/i18n/config";

const ProductsPage = async ({
  searchParams,
  params,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  params: Promise<{
    locale: string;
  }>;
}) => {
  const { locale } = await params;
  const queryParams = await searchParams;
  const dict = await getDictionary(locale);
  return (
    <div>
      <ProductList
        query={queryParams}
        params="products"
        locale={locale}
        dict={dict}
      />
    </div>
  );
};

export default ProductsPage;
