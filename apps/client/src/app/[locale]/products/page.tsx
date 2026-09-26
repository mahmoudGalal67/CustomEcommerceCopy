import ProductList from "@/components/ProductList";
import { getDictionary } from "@/i18n/config";

const ProductsPage = async ({
  searchParams,
  params
}: {
  searchParams: Record<string, string>;
  params: Promise<{
    locale: string;
  }>;
}) => {
  const { locale } = await params;
    const dict = await getDictionary(locale);
  return (
    <div>
      <ProductList query={searchParams} params="products" locale={locale} dict={dict} />
    </div>
  );
};

export default ProductsPage;
