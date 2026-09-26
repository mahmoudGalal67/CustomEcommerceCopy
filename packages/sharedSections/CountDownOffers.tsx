"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useGetProductsByNamesOrIdsQuery } from "@/services/ProductsApi";

const useCountdown = (endTime: string) => {
  const calculateTimeLeft = () => {
    const difference = new Date(endTime).getTime() - new Date().getTime();

    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return timeLeft;
};

const Countdown = ({ endTime }: { endTime: string }) => {
  const timeLeft = useCountdown(endTime);

  if (!timeLeft) {
    return <span className="text-red-500">Expired</span>;
  }

  return (
    <div className="flex gap-2 text-sm font-medium">
      {Object.entries(timeLeft).map(([key, value]) => (
        <div key={key} className="rounded-md bg-black px-2 py-1 text-white">
          {value} {key}
        </div>
      ))}
    </div>
  );
};

export default function CountdownOffers({ offers, title, apiUrl }: any) {
  const productIds = offers?.map((offer: any) => offer.offerProduct) || [];

  const { data: filteredProducts } = useGetProductsByNamesOrIdsQuery({
    ids: productIds,
  });

  /*
   * Only keep offers whose product still exists.
   *
   * If the original product was deleted,
   * it won't exist in filteredProducts,
   * so its offer will automatically disappear.
   */
  const validOffers =
    offers?.filter((offer: any) =>
      filteredProducts?.some(
        (product: any) => product?.id === offer?.offerProduct,
      ),
    ) || [];

  // Don't render the section if there are no valid offers
  // if (!validOffers.length) {
  //   return null;
  // }

  return (
    <section className="my-5 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 text-3xl font-bold">🔥 {title}</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {validOffers.map((offer: any) => {
            const product = filteredProducts?.find(
              (p: any) => p?.id === offer?.offerProduct,
            );

            if (!product) {
              return null;
            }

            const originalPrice =
              product?.base_price !== "0.00"
                ? Number(product.base_price)
                : Number(product?.variants?.[0]?.price || 0);

            const discountedPrice =
              originalPrice * (1 - Number(offer.offerValue) / 100);

            const image = product?.base_images?.[0]
              ? `${apiUrl}/storage/${product.base_images[0]}`
              : product?.variants?.[0]?.images?.[0]?.file_path
                ? `${apiUrl}/storage/${product.variants[0].images[0].file_path}`
                : "https://via.placeholder.com/400x300?text=No+Image";

            return (
              <motion.div
                key={offer.id}
                whileHover={{ scale: 1.05 }}
                className="rounded-2xl"
              >
                <Card className="overflow-hidden shadow-lg">
                  <img
                    src={image}
                    alt={product?.name || "Product"}
                    className="h-48 w-full object-cover"
                  />

                  <CardContent className="space-y-3 p-4">
                    <h3 className="text-lg font-semibold">
                      {offer.offerValue}% Discount
                    </h3>

                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-green-600">
                        ${discountedPrice.toFixed(2)}
                      </span>

                      <span className="text-gray-400 line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                    </div>

                    <Countdown endTime={offer.date} />

                    <Button className="w-full">Buy Now</Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
