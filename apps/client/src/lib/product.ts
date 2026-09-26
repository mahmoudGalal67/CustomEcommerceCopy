import { GroupedVariant, ProductType } from "@/types/types";

export function groupProductVariants(product: ProductType): GroupedVariant[] {
  const grouped: Record<string, GroupedVariant> = {};

  product.variants.forEach((variant) => {
    const variantImages = variant.images.map((img) => img.file_path);

    // if this size is not in grouped, create it
    if (!grouped[variant.size?.code]) {
      grouped[variant.size?.code] = {
        size: variant.size,
        colors: [],
      };
    }

    // push color with its images
    grouped[variant.size?.code].colors.push({
      variant_id: variant.id,
      color: variant.color,
      images: variantImages,
      price: variant.price,
      stock: variant.stock,
    });
  });
  console.log(grouped)
  return Object.values(grouped);
}
