"use client";

import { useAddToCart } from "@/hooks/cart";
import {
  GroupedVariant,
  ProductsType,
  ProductType,
  VariantColor,
  VariantSize,
} from "@/types/types";
import { Loader, Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const ProductInteraction = ({
  product,
  groupedVariants,
  activeSizeGroup,
  activeColor,
  dict,
  locale,
}: {
  product: ProductType;
  groupedVariants?: GroupedVariant[];
  activeSizeGroup?: {
    size: VariantSize;
    colors: {
      color: VariantColor;
      images: string[];
      price: string | number;
      stock: string | number;
    }[];
  };
  activeColor?: {
    color: VariantColor;
    images: string[];
    price: string | number;
    stock: string | number;
    variant_id: string | number;
  };
  dict: any;
  locale: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [quantity, setQuantity] = useState(1);

  const hasVariants = groupedVariants && groupedVariants.length > 0;

  const currentStock = Number(hasVariants ? activeColor?.stock : product.stock);

  const isOutOfStock = currentStock <= 0;
  const hasInsufficientStock = quantity > currentStock;

  const { AddToCartHook, isLoading } = useAddToCart();

  const handleTypeChange = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type == "size") {
      const varaint = groupedVariants?.find(
        (variant) => variant.size.name == value,
      );

      params.set(type, value);
      params.set("color", varaint?.colors[0].color.name as string);
    } else {
      params.set(type, value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
  console.log(product);
  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment") {
      if (quantity >= currentStock) {
        toast.error(
          locale === "ar"
            ? `الكمية المتاحة فقط ${currentStock}`
            : `Only ${currentStock} item${currentStock !== 1 ? "s" : ""} available`,
        );
        return;
      }

      setQuantity((prev) => prev + 1);
    } else {
      if (quantity > 1) {
        setQuantity((prev) => prev - 1);
      }
    }
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      toast.error(
        locale === "ar"
          ? "هذا المنتج غير متوفر حاليًا"
          : "This product is currently out of stock",
      );
      return;
    }

    if (quantity > currentStock) {
      toast.error(
        locale === "ar"
          ? `الكمية المتاحة فقط ${currentStock}`
          : `Only ${currentStock} item${currentStock !== 1 ? "s" : ""} available`,
      );
      return;
    }
    const response = await AddToCartHook({
      product_id: hasVariants ? undefined : product.id,
      variant_id: activeColor?.variant_id,
      price: hasVariants ? activeColor?.price : product.base_price,
      quantity,
      seller_id: product.seller_id,
    });

    toast.success(
      locale == "ar"
        ? "تمت إضافة المنتج إلى عربة التسوق"
        : "Product added to cart",
    );
  };
  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* SIZE */}
      {hasVariants && (
        <>
          {/* SIZE */}
          <div className="flex flex-col gap-2 text-xs">
            <span>{dict.labels.size}</span>

            <div className="flex items-center gap-2">
              {groupedVariants.map((variant) => (
                <div
                  key={variant.size.name}
                  className={`cursor-pointer border p-[2px] ${
                    activeSizeGroup?.size.name === variant.size.name
                      ? "border-gray-600"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleTypeChange("size", variant.size.name)}
                >
                  <div
                    className={`w-6 h-6 flex items-center justify-center ${
                      activeSizeGroup?.size.name === variant.size.name
                        ? "bg-black text-white"
                        : ""
                    }`}
                  >
                    {variant.size.name.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLOR */}
          <div className="flex flex-col gap-2 text-sm">
            <span>{dict.labels.color}</span>

            <div className="flex items-center gap-2">
              {activeSizeGroup?.colors.map((item) => (
                <div
                  key={item.color.name}
                  className={`cursor-pointer border p-[2px] ${
                    activeColor?.color?.name === item.color.name
                      ? "border-gray-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleTypeChange("color", item.color.name)}
                >
                  <div
                    className="w-6 h-6"
                    style={{
                      backgroundColor: item.color.hex,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {/* QUANTITY */}
      <div className="flex flex-col gap-2 text-sm">
        <span>{dict.labels.quantity}</span>
        <div className="flex items-center gap-2">
          <button
            disabled={quantity <= 1 || isOutOfStock}
            className="cursor-pointer border-1 border-gray-300 p-1"
            onClick={() => handleQuantityChange("decrement")}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span>{quantity}</span>
          <button
            disabled={quantity >= currentStock || isOutOfStock}
            className="cursor-pointer border-1 border-gray-300 p-1"
            onClick={() => handleQuantityChange("increment")}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* STOCK */}
      <div
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
          isOutOfStock
            ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
            : currentStock <= 5
              ? "border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-900/50 dark:bg-orange-950/30 dark:text-orange-400"
              : "border-green-200 bg-green-50 text-green-600 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            isOutOfStock
              ? "bg-red-500"
              : currentStock <= 5
                ? "bg-orange-500"
                : "bg-green-500"
          }`}
        />

        {isOutOfStock ? (
          <span className="font-medium">
            {locale === "ar" ? "غير متوفر" : "Out of stock"}
          </span>
        ) : (
          <span>
            {currentStock <= 5 && (
              <span className="ml-1 font-medium">
                {locale === "ar" ? "متبقي فقط" : "left"}
              </span>
            )}
            <span className="font-semibold">{currentStock}</span>
          </span>
        )}
      </div>
      {/* QUANTITY WARNING */}
      {hasInsufficientStock && !isOutOfStock && (
        <p className="text-sm font-medium text-destructive">
          {locale === "ar"
            ? `الكمية المطلوبة أكبر من المخزون المتاح (${currentStock})`
            : `Requested quantity exceeds available stock (${currentStock})`}
        </p>
      )}{" "}
      <div className="text-sm text-gray-500">
        {dict.labels.stock}: {hasVariants ? activeColor?.stock : product.stock}
      </div>
      {/* BUTTONS */}
      <button
        onClick={handleAddToCart}
        className={`${locale === "ar" ? "flex-row-reverse" : ""} ring-1 hover:scale-105 transform ease-in-out duration-300 ring-gray-400  px-4 py-2 rounded-md shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm font-medium`}
      >
        {isLoading ? (
          <Loader className="w-4 h-4" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
        {isLoading ? dict.Buttons.loading : dict.Buttons.addToCart}
      </button>
      {/* <button className="ring-1 ring-gray-400 shadow-lg  px-4 py-2 rounded-md flex items-center justify-center cursor-pointer gap-2 text-sm font-medium">
        <ShoppingCart className="w-4 h-4" />
        {dict.Buttons.buy}
      </button> */}
      <button
        className={`${locale === "ar" ? "flex-row-reverse" : ""} ring-1  hover:scale-105 transform ease-in-out duration-300  ring-gray-400 shadow-lg  px-4 py-2 rounded-md flex items-center justify-center cursor-pointer gap-2 text-sm font-medium`}
      >
        <Image
          src="/whatsapp.png"
          width={18}
          height={18}
          alt="WhatsApp"
          className="w-4 h-4"
        />
        <a
          href={`https://wa.me/${product?.seller?.phone}?text=I'm%20interested%20in%20your%20product%20${product.translations[0].name}%20 product ID = (${product.id})`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {dict.Buttons.contactByWhatsapp}
        </a>
      </button>
    </div>
  );
};

export default ProductInteraction;
