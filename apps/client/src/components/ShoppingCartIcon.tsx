"use client";

import { useGetCartQuery } from "@/services/cartApi";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const ShoppingCartIcon = ({ locale }: { locale: string }) => {
  const { data: cartItems } = useGetCartQuery(undefined);

  const itemCount = cartItems?.items?.length ?? 0;

  return (
    <Link
      href={`/${locale}/cart`}
      aria-label={`Shopping cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
      className="relative"
    >
      <ShoppingCart className="h-4 w-4 text-text" />

      {itemCount > 0 && (
        <span className="absolute -top-3 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
};

export default ShoppingCartIcon;
