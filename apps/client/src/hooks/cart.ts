import { useAddToUserCartMutation } from "@/services/cartApi";

export const useAddToCart = () => {
  const [addToUserCart, { isLoading }] = useAddToUserCartMutation();

  const AddToCartHook = async (variant: any) => {
    await addToUserCart({
      variant_id: variant.variant_id,
      product_id: variant.product_id,
      seller_id: variant.seller_id,
      unit_price: variant.price,
      quantity: variant?.quantity ? variant?.quantity : 1,
    });
  };

  return { AddToCartHook, isLoading };
};
