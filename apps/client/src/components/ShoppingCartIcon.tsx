"use client";

import { useGetCartQuery } from "@/services/cartApi";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const ShoppingCartIcon = ({ locale }: { locale: string }) => {
  const { data: cartItems }: any = useGetCartQuery(undefined);
  return (
    <Link href={`/${locale}/cart`} className="relative">
      <ShoppingCart className="w-4 h-4  text-text" />
      <span className="absolute -top-3 -right-3 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-medium">
        {cartItems?.items?.length}
      </span>
    </Link>
  );
};

export default ShoppingCartIcon;
