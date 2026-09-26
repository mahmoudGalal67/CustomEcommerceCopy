"use client";
import Image from "next/image";

import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/services/wishlistApi";

import { Trash2 } from "lucide-react";
import { useParams } from "next/navigation";

const WishlistPage = () => {
  const params = useParams();
  const locale = (params.locale || "en") as string;
  const { data: wishlistItems }: any = useGetWishlistQuery(undefined);
  const [removeFromWishlist, { isLoading, error }] =
    useRemoveFromWishlistMutation();

  const deleteWishlistItem = (id: string) => {
    removeFromWishlist(id).unwrap();
  };
  if (!wishlistItems?.items?.length)
    return (
      <div className="text-center p-16 text-3xl">
        {" "}
        {locale == "ar"
          ? "قائمة رغباتك فارغة 🛒"
          : " Your wishlist is empty 🛒"}
      </div>
    );
  if (isLoading)
    return (
      <div className="text-center p-16 text-3xl">
        {" "}
        {locale == "ar"
          ? "جارٍ تحميل قائمة الرغبات... 🛒"
          : "Loading wishlist ... 🛒"}
      </div>
    );
  if (error)
    return (
      <div className="text-center p-16 text-3xl">
        {locale == "ar" ? "حدث خطأ ما ... 🛒" : "Something went wrong ... 🛒"}
      </div>
    );

  return (
    <div className="flex flex-col gap-8 items-center justify-center mt-12">
      {/* TITLE */}
      <h1 className="text-2xl font-medium">
        {" "}
        {locale == "ar" ? "قائمة رغباتك" : "Your Wishlist"}
      </h1>

      {/* STEPS & DETAILS */}
      <div className="w-full flex flex-col lg:flex-row gap-16">
        {/* STEPS */}
        <div className="w-full lg:w-7/12 shadow-lg border-1 border-gray-100 p-8 rounded-lg flex flex-col gap-8">
          {wishlistItems?.items.map((item: any) => (
            // SINGLE WISHLIST ITEM
            <div
              className="flex items-center justify-between"
              key={`${item.id}-${item.product_id}`}
            >
              {/* IMAGE AND DETAILS */}
              <div className="flex gap-8 items-center">
                {/* IMAGE */}
                <div className="relative w-32 h-32 bg-gray-50 rounded-lg overflow-hidden">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${item.product?.variants?.[0]?.images?.[0]?.file_path}`}
                    alt={
                      item.product?.translations?.find(
                        (t: any) => t.locale == locale,
                      )?.name ?? "Product"
                    }
                    fill
                    className="object-contain"
                  />
                </div>
                {/* ITEM DETAILS */}
                <div className="flex flex-col justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">
                      {" "}
                      {
                        item.product?.translations?.find(
                          (t: any) => t.locale == locale,
                        )?.name
                      }
                    </p>
                  </div>
                </div>
              </div>
              {/* DELETE BUTTON */}
              <button
                className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 transition-all duration-300 text-red-400 flex items-center justify-center cursor-pointer"
                onClick={() => deleteWishlistItem(item.id)}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
