"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useAddToCart } from "@/hooks/cart";
import { groupProductVariants } from "@/lib/product";
import { ProductType } from "@/types/types";

import { ShoppingCart, Heart, Loader2, CircleAlert } from "lucide-react";
import { useParams } from "next/navigation";

import {
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "@/services/wishlistApi";

const ProductCard = ({
  product,
  dict,
}: {
  product: ProductType;
  dict: any;
}) => {
  const params = useParams();
  const locale = (params.locale || "en") as string;

  const translation = product.translations.find((t) => t.locale === locale);

  const productVariants = groupProductVariants(product);

  const [activeSizeIndex, setActiveSizeIndex] = useState(0);
  const [activeColorIndex, setActiveColorIndex] = useState(0);

  const { data: wishlist, isLoading: isWishlistLoading } =
    useGetWishlistQuery(undefined);

  const [toggleWishlist, { isLoading: isWishlistToggling }] =
    useToggleWishlistMutation();

  const isWishlisted =
    wishlist?.items?.some((item: any) => item.product_id === product.id) ??
    false;

  /*
  |--------------------------------------------------------------------------
  | Active variant
  |--------------------------------------------------------------------------
  */

  const activeVariant = productVariants.length
    ? {
        ...productVariants[activeSizeIndex],
        colors: productVariants[activeSizeIndex]?.colors?.[activeColorIndex],
      }
    : null;

  /*
  |--------------------------------------------------------------------------
  | Stock
  |--------------------------------------------------------------------------
  */

  const currentStock = productVariants.length
    ? Number(activeVariant?.colors?.stock ?? 0)
    : Number(product.stock ?? 0);

  const isOutOfStock = currentStock <= 0;

  /*
  |--------------------------------------------------------------------------
  | Wishlist
  |--------------------------------------------------------------------------
  */

  const handleWishlist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await toggleWishlist({
        product_id: product.id,
      }).unwrap();
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Add to cart
  |--------------------------------------------------------------------------
  */

  const { AddToCartHook, isLoading } = useAddToCart();

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      return;
    }

    if (productVariants.length && !activeVariant?.colors) {
      return;
    }

    await AddToCartHook({
      ...(activeVariant?.colors ?? {}),
      seller_id: product.seller_id,
      product_id: product.id,
    });
  };

  return (
    <div
      className="
        group
        flex flex-col
        overflow-hidden
        rounded-lg
        shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15)]
        dark:border
        dark:border-gray-800
        dark:shadow-[0_10px_25px_-5px_rgba(255,255,255,0.08)]
      "
    >
      {/* ================================================================ */}
      {/* IMAGE */}
      {/* ================================================================ */}

      <Link href={`/${locale}/products/${product.id}`}>
        <div className="relative aspect-[4/5] overflow-hidden">
          {/* PRODUCT IMAGE */}

          {!productVariants.length ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${product.base_images?.[0]}`}
              alt={translation?.name || product.name}
              fill
              className={`
                object-cover
                transition-all
                duration-300
                ${
                  isOutOfStock
                    ? "grayscale opacity-50"
                    : "group-hover:scale-105"
                }
              `}
            />
          ) : (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${activeVariant?.colors?.images?.[0]}`}
              alt={translation?.name || product.name}
              fill
              className={`
                object-cover
                transition-all
                duration-300
                ${
                  isOutOfStock
                    ? "grayscale opacity-50"
                    : "group-hover:scale-105"
                }
              `}
            />
          )}

          {/* ============================================================ */}
          {/* OUT OF STOCK OVERLAY */}
          {/* ============================================================ */}

          {isOutOfStock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/45 backdrop-blur-[1px]">
              <div className="flex flex-col items-center gap-2 rounded-xl bg-black/65 px-6 py-4 text-center shadow-xl">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                  <CircleAlert className="h-6 w-6 text-white" />
                </div>

                <span className="text-base font-semibold text-white">
                  {locale === "ar" ? "غير متوفر حاليًا" : "Out of Stock"}
                </span>

                <span className="text-xs text-white/70">
                  {locale === "ar"
                    ? "هذا المنتج غير متوفر"
                    : "This product is currently unavailable"}
                </span>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* WISHLIST */}
          {/* ============================================================ */}

          <button
            type="button"
            onClick={handleWishlist}
            disabled={isWishlistToggling || isWishlistLoading}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            className={`
              group absolute right-3 top-3 z-20
              flex h-10 w-10 items-center justify-center
              rounded-full
              bg-white/90
              shadow-md
              backdrop-blur-sm
              transition-all
              duration-300
              hover:scale-110
              active:scale-90
              disabled:cursor-wait
              dark:bg-gray-900/90
              ${
                isWishlisted
                  ? "text-red-500 shadow-red-500/20"
                  : "text-gray-600 hover:text-red-500 dark:text-gray-300"
              }
            `}
          >
            {isWishlisted && !isWishlistToggling && (
              <span className="absolute inset-0 animate-ping rounded-full bg-red-400/20" />
            )}

            {isWishlistToggling ? (
              <Loader2 className="relative z-10 h-5 w-5 animate-spin" />
            ) : (
              <Heart
                className={`
                  relative z-10
                  h-5 w-5
                  transition-all
                  duration-300
                  ${
                    isWishlisted
                      ? "scale-110 fill-red-500 stroke-red-500"
                      : "scale-100 fill-transparent"
                  }
                `}
              />
            )}
          </button>

          {/* ============================================================ */}
          {/* SMALL STOCK BADGE */}
          {/* ============================================================ */}

          <div className="absolute left-3 top-3 z-20">
            {isOutOfStock ? (
              <span className="inline-flex items-center rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-md">
                {locale === "ar" ? "غير متوفر" : "Unavailable"}
              </span>
            ) : currentStock <= 5 ? (
              <span className="inline-flex items-center rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
                {locale === "ar"
                  ? `متبقي ${currentStock} فقط`
                  : `Only ${currentStock} left`}
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      {/* ================================================================ */}
      {/* PRODUCT DETAIL */}
      {/* ================================================================ */}

      <div className="flex flex-col gap-4 p-4">
        <h1 className="font-medium">{translation?.name}</h1>

        <p className="line-clamp-2 text-sm text-gray-500">
          {translation?.description}
        </p>

        {/* ============================================================ */}
        {/* PRODUCT TYPES */}
        {/* ============================================================ */}

        <div className="flex items-center gap-4 text-xs">
          {/* SIZES */}

          {productVariants.length ? (
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">{dict.variant.size}</span>

              <select
                name="size"
                id={`size-${product.id}`}
                value={activeSizeIndex}
                className="rounded-md px-2 py-1 ring-1 ring-gray-300"
                onChange={(e) => {
                  setActiveSizeIndex(Number(e.target.value));
                  setActiveColorIndex(0);
                }}
              >
                {productVariants.map((item, i) => (
                  <option key={item.size?.code} value={i}>
                    {item.size?.name?.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {/* COLORS */}

          {productVariants.length ? (
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">{dict.variant.color}</span>

              <div className="flex items-center gap-2">
                {productVariants[activeSizeIndex]?.colors?.map((item, i) => {
                  const colorStock = Number(item.stock ?? 0);

                  const colorOutOfStock = colorStock <= 0;

                  return (
                    <button
                      type="button"
                      key={item.color?.name}
                      onClick={() => setActiveColorIndex(i)}
                      className={`
                        rounded-full border p-[1.2px]
                        ${
                          activeColorIndex === i
                            ? "border-gray-500"
                            : "border-gray-200"
                        }
                      `}
                      title={
                        colorOutOfStock
                          ? locale === "ar"
                            ? "غير متوفر"
                            : "Out of stock"
                          : item.color?.name
                      }
                    >
                      <div
                        className={`
                          h-[14px]
                          w-[14px]
                          rounded-full
                          ${colorOutOfStock ? "grayscale opacity-40" : ""}
                        `}
                        style={{
                          backgroundColor: item.color?.hex,
                        }}
                      />
                    </button>
                  );
                })}

                <span className="text-gray-500">
                  {activeVariant?.colors?.price} $
                </span>
              </div>
            </div>
          ) : (
            <span className="text-gray-500">{product.base_price} $</span>
          )}
        </div>

        {/* ============================================================ */}
        {/* ADD TO CART */}
        {/* ============================================================ */}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isLoading || isOutOfStock}
            className="
              flex
              items-center
              gap-2
              rounded-md
              px-3
              py-2
              text-sm
              ring-1
              ring-gray-200
              transition-all
              duration-300

              hover:bg-primary
              hover:text-white
              hover:ring-primary

              disabled:cursor-not-allowed
              disabled:bg-gray-100
              disabled:text-gray-400
              disabled:ring-gray-200
              disabled:opacity-70

              dark:disabled:bg-gray-800
              dark:disabled:text-gray-500
            "
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isOutOfStock ? (
              <CircleAlert className="h-4 w-4" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}

            {isLoading
              ? locale === "ar"
                ? "جاري الإضافة..."
                : "Adding..."
              : isOutOfStock
                ? locale === "ar"
                  ? "غير متوفر"
                  : "Out of Stock"
                : dict.Buttons.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
