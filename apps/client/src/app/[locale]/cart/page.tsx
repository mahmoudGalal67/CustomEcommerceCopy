"use client";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import PaymentForm from "@/components/PaymentForm";
import ShippingForm from "@/components/ShippingForm";
import { ShippingFormInputs } from "@/types/types";
import { useState } from "react";

import { useGetCartQuery, useRemoveFromCartMutation } from "@/services/cartApi";
import { steps } from "@/constants/contsnts";

import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react";

const CartPage = () => {
  const params = useParams();
  const locale = (params.locale || "en") as string;
  const [shippingForm, setShippingForm] = useState<ShippingFormInputs>();

  const searchParams = useSearchParams();
  const router = useRouter();

  const { data: cartItems, isLoading }: any = useGetCartQuery(undefined);
  const [removeFromCart, { error }] = useRemoveFromCartMutation();

  const activeStep = parseInt(searchParams.get("step") || "1");
  const discount = 10;
  const subtotal =
    cartItems?.items?.reduce((acc: number, item: any) => {
      const price =
        item.variant?.price ?? item.product?.base_price ?? item.unit_price ?? 0;

      return acc + Number(price) * item.quantity;
    }, 0) ?? 0;
  const totalAmount = subtotal.toFixed(2) - discount;

  const deleteCartItem = (id: string) => {
    removeFromCart(id).unwrap();
  };
  if (isLoading)
    return (
      <div className="text-center p-16 text-3xl">
        {" "}
        {locale == "ar"
          ? "جاري تحميل عربة التسوق... 🛒"
          : " Loading cart ... 🛒"}
      </div>
    );
  if (!isLoading && !cartItems?.items?.length)
    return (
      <div className="text-center p-16 text-3xl">
        {locale == "ar" ? "عربة التسوق الخاصة بك فارغة" : "Your cart is empty "}
        🛒
      </div>
    );

  if (error)
    return (
      <div className="text-center p-16 text-3xl">
        {locale == "ar" ? "حدث خطأ ما ... 🛒" : "Somting went wrong ... 🛒"}
      </div>
    );
  const hasStockIssue =
    cartItems?.items?.some((item: any) => {
      const stock = Number(item.variant?.stock ?? item.product?.stock ?? 0);

      return stock <= 0 || item.quantity > stock;
    }) ?? false;
  console.log(cartItems);

  return (
    <div className="flex flex-col gap-8 items-center justify-center mt-12">
      {/* TITLE */}
      <h1 className="text-2xl font-medium">
        {locale == "ar" ? "عربة التسوق الخاصة بك" : "Your Shopping Cart "}
      </h1>
      {/* STEPS */}
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {steps.map((step: any) => (
          <div
            className={`flex items-center gap-2 border-b-2 pb-4 ${
              step.id === activeStep ? "border-gray-800" : "border-gray-200"
            }`}
            key={step.id}
          >
            <div
              className={`w-6 h-6 rounded-full text-white p-4 flex items-center justify-center ${
                step.id === activeStep ? "bg-gray-800" : "bg-gray-400"
              }`}
            >
              {step.id}
            </div>
            <p
              className={`text-sm font-medium ${
                step.id === activeStep ? "text-gray-800" : "text-gray-400"
              }`}
            >
              {step.title[locale]}
            </p>
          </div>
        ))}
      </div>
      {/* STEPS & DETAILS */}
      <div className="w-full flex flex-col lg:flex-row gap-16">
        {/* STEPS */}
        <div className="w-full lg:w-7/12 shadow-lg border-1 border-gray-100 p-8 rounded-lg flex flex-col gap-8">
          {activeStep === 1 ? (
            cartItems?.items.map((item: any) => (
              // SINGLE CART ITEM
              <div
                className={`relative flex items-center justify-between rounded-xl border p-3 transition-all ${(() => {
                  const stock = Number(
                    item.variant?.stock ?? item.product?.stock ?? 0,
                  );

                  if (stock <= 0) {
                    return "border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20";
                  }

                  if (item.quantity > stock) {
                    return "border-orange-200 bg-orange-50/50 dark:border-orange-900/50 dark:bg-orange-950/20";
                  }

                  return "border-transparent";
                })()}`}
                key={`${item.id}-${item.variant?.id ?? item.product_id}`}
              >
                {/* IMAGE AND DETAILS */}
                <div className="flex gap-8">
                  {/* IMAGE */}
                  <div className="relative w-32 h-32 bg-gray-50 rounded-lg overflow-hidden">
                    <Image
                      src={
                        item.variant
                          ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${item.variant.images[0].file_path}`
                          : `${process.env.NEXT_PUBLIC_API_URL}/storage/${item.product?.base_images?.[0]}`
                      }
                      alt={
                        item.variant?.color?.name ??
                        item.variant?.product?.translations?.find(
                          (t: any) => t.locale == locale,
                        )?.name ??
                        "Product"
                      }
                      fill
                      className="object-contain"
                    />
                    {(() => {
                      const stock = Number(
                        item.variant?.stock ?? item.product?.stock ?? 0,
                      );

                      if (stock <= 0) {
                        return (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                              {locale === "ar" ? "غير متوفر" : "Out of Stock"}
                            </span>
                          </div>
                        );
                      }

                      if (item.quantity > stock) {
                        return (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                              {locale === "ar"
                                ? "الكمية غير متاحة"
                                : "Quantity Unavailable"}
                            </span>
                          </div>
                        );
                      }

                      return null;
                    })()}
                  </div>
                  {/* ITEM DETAILS */}
                  <div className="flex flex-col justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">
                        {" "}
                        {item.variant
                          ? item.variant?.product?.translations?.find(
                              (t: any) => t.locale == locale,
                            )?.name
                          : item.product?.translations?.find(
                              (t: any) => t.locale == locale,
                            )?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {locale === "ar" ? "الكمية: " : "Quantity: "}
                        {item.quantity}
                      </p>

                      {(() => {
                        const stock = Number(
                          item.variant?.stock ?? item.product?.stock ?? 0,
                        );

                        if (stock <= 0) {
                          return (
                            <p className="mt-1 text-xs font-semibold text-red-600 dark:text-red-400">
                              {locale === "ar"
                                ? "هذا المنتج غير متوفر حاليًا"
                                : "This product is currently out of stock"}
                            </p>
                          );
                        }

                        if (item.quantity > stock) {
                          return (
                            <p className="mt-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
                              {locale === "ar"
                                ? `متوفر ${stock} فقط`
                                : `Only ${stock} available`}
                            </p>
                          );
                        }

                        return (
                          <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                            {locale === "ar"
                              ? `${stock} متاح`
                              : `${stock} available`}
                          </p>
                        );
                      })()}
                      {item.variant && (
                        <>
                          <p className="text-xs text-gray-500">
                            {locale == "ar" ? "مقاس:" : "Size:"}
                            {item.variant.size?.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {locale == "ar" ? "لون:" : " Color:"}
                            {item.variant.color?.name}
                          </p>
                        </>
                      )}
                    </div>
                    <p className="font-medium">
                      $
                      {Number(
                        item.variant?.price ?? item.product?.base_price ?? 0,
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
                {/* DELETE BUTTON */}
                <button
                  className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 transition-all duration-300 text-red-400 flex items-center justify-center cursor-pointer"
                  onClick={() => deleteCartItem(item.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          ) : activeStep === 2 ? (
            <ShippingForm setShippingForm={setShippingForm} locale={locale} />
          ) : activeStep === 3 && shippingForm ? (
            <PaymentForm
              totalAmount={totalAmount}
              shippingData={shippingForm}
              locale={locale}
            />
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-16">
                {locale == "ar"
                  ? "يرجى تعبئة نموذج الشحن للمتابعة."
                  : "Please fill in the shipping form to continue."}
              </p>
              <button
                onClick={() =>
                  router.push(`/${locale}/cart?step=2`, { scroll: false })
                }
                className="w-full bg-gray-800 hover:bg-gray-900 transition-all duration-300 text-white p-2 rounded-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-3 h-3" />

                {locale == "ar" ? "خلف" : "Back"}
              </button>
            </div>
          )}
        </div>
        {/* DETAILS */}
        <div className="w-full lg:w-5/12 shadow-lg  border-gray-100 p-8 rounded-lg flex flex-col gap-8 h-max">
          <h2 className="font-semibold">
            {locale == "ar" ? "تفاصيل عربة التسوق" : " Cart Details"}
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">
                {locale == "ar" ? "المجموع الفرعي" : "Subtotal"}
              </p>
              <p className="font-medium">${totalAmount}</p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">
                {locale == "ar" ? "تخفيض" : "Discount"}
              </p>
              <p className="font-medium">{discount} $ </p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">
                {locale == "ar" ? "رسوم الشحن" : " Shipping Fee"}
              </p>
              <p className="font-medium">$0</p>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between">
              <p className="text-gray-800 font-semibold">
                {locale == "ar" ? "المجموع الكلي" : "Total"}
              </p>
              <p className="font-medium">${totalAmount}</p>
            </div>
          </div>
          {activeStep === 1 && (
            <div className="flex flex-col gap-3">
              {hasStockIssue && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
                  <span className="mt-0.5">⚠️</span>

                  <span>
                    {locale === "ar"
                      ? "يوجد منتج غير متوفر أو أن الكمية المطلوبة أكبر من المخزون المتاح. يرجى تحديث عربة التسوق للمتابعة."
                      : "One or more items are unavailable or the requested quantity exceeds available stock. Please update your cart before continuing."}
                  </span>
                </div>
              )}

              <button
                disabled={hasStockIssue}
                onClick={() =>
                  router.push(`/${locale}/cart?step=2`, {
                    scroll: false,
                  })
                }
                className="
        flex w-full items-center justify-center gap-2
        rounded-lg p-2
        text-white
        transition-all duration-300
        bg-gray-800
        hover:bg-gray-900
        disabled:cursor-not-allowed
        disabled:bg-gray-300
        disabled:text-gray-500
        disabled:opacity-70
        dark:disabled:bg-gray-800
        dark:disabled:text-gray-500
      "
              >
                {hasStockIssue
                  ? locale === "ar"
                    ? "تحديث عربة التسوق أولاً"
                    : "Update Cart First"
                  : locale === "ar"
                    ? "الاستمرار"
                    : "Continue"}

                {!hasStockIssue &&
                  (locale === "ar" ? (
                    <ArrowLeft className="h-3 w-3" />
                  ) : (
                    <ArrowRight className="h-3 w-3" />
                  ))}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
