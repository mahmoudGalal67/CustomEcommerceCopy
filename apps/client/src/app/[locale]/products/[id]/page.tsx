import ProductAccordion from "@/components/Product/ProductAccordion";
import ProductGallery from "@/components/Product/ProductGallery";
import ProductInteraction from "@/components/ProductInteraction";
import { getDictionary } from "@/i18n/config";
import { groupProductVariants } from "@/lib/product";
import { productsAPi } from "@/utilis/api";
import Image from "next/image";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{
    id: string;
    locale: "en" | "ar";
  }>;
}) => {
  const { id, locale } = await params;
  const { data: product } = await productsAPi.getProductDetials({
    id: id,
    locale: locale,
  });
  return {
    title: product.name,
    describe: product.description,
  };
};

const ProductPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; locale: "en" | "ar" }>;
  searchParams: Promise<{ color: string; size: string }>;
}) => {
  const { size, color } = await searchParams;
  const { id, locale } = await params;
  const dict = await getDictionary(locale);

  const { data: product } = await productsAPi.getProductDetials({ id, locale });

  const groupedVariants = groupProductVariants(product);

  const hasVariants = groupedVariants.length > 0;

  const selectedSize = hasVariants
    ? size || groupedVariants[0].size.name
    : null;

  const selectedColor = hasVariants
    ? color || groupedVariants[0].colors[0].color.name
    : null;

  const activeSizeGroup = hasVariants
    ? groupedVariants.find(
        (g) => g.size.code === selectedSize || g.size.name === selectedSize,
      )
    : null;

  const activeColor = hasVariants
    ? activeSizeGroup?.colors.find(
        (c) => c.color.hex === selectedColor || c.color.name === selectedColor,
      )
    : null;

  return (
    <div className="flex flex-col gap-4 lg:flex-row md:gap-12 mt-12">
      {/* IMAGE */}
      <div className="w-full lg:w-7/12 relative aspect-[2/3]">
        <ProductGallery
          images={
            hasVariants ? activeColor?.images || [] : product.base_images || []
          }
          locale={locale}
        />
      </div>

      {/* DETAILS */}
      <div className="w-full lg:w-7/12 flex flex-col gap-4">
        <h1 className="text-2xl font-medium">{product.translations[0].name}</h1>
        <p className="text-muted-foreground">
          {product.translations[0].description}
        </p>
        <h2 className="text-2xl font-semibold">
          ${" "}
          {hasVariants
            ? Number(activeColor?.price).toFixed(2)
            : Number(product.base_price).toFixed(2)}
        </h2>

        {
          <ProductInteraction
            product={product}
            groupedVariants={groupedVariants}
            activeSizeGroup={activeSizeGroup ?? undefined}
            activeColor={activeColor ?? undefined}
            dict={dict}
            locale={locale}
          />
        }
        <ProductAccordion
          description={product.translations[0].description}
          dict={dict}
        />

        {/* CARD INFO */}
        <div className="flex items-center gap-2 mt-4">
          <Image
            src="/klarna.png"
            alt="klarna"
            width={50}
            height={25}
            className="rounded-md"
          />
          <Image
            src="/cards.png"
            alt="cards"
            width={50}
            height={25}
            className="rounded-md"
          />
          <Image
            src="/stripe.png"
            alt="stripe"
            width={50}
            height={25}
            className="rounded-md"
          />
        </div>
        <p className="text-gray-500 text-xs">{dict.labels.privacyDesc}</p>
      </div>
    </div>
  );
};

export default ProductPage;
