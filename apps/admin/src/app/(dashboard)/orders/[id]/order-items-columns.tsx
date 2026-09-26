"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
export type OrderItem = {
  id: number;
  order_id: number;
  seller_order_id: number;
  variant_id: number | null;
  product_id: number;
  quantity: number;
  unit_price: string;
  line_total: string;
  variant_sku: string | null;
  color: string | null;
  size: string | null;
  product?: {
    id: number;
    slug: string;
    base_images: string[];
    base_price: string;
    translations: {
      id: number;
      locale: string;
      name: string;
      description: string;
    }[];
  } | null;
  variant?: {
    product?: { name: string };
    color?: { name: string };
    size?: { name: string };
  } | null;
};
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
export const orderItemsColumns: ColumnDef<OrderItem>[] = [
  {
    header: "Product",
    cell: ({ row }) => {
      const item = row.original;
      const productName =
        item.product?.translations?.find(
          (translation) => translation.locale === "en",
        )?.name ??
        item.product?.translations?.[0]?.name ??
        item.variant?.product?.name ??
        "Unknown Product";
      const color = item.color ?? item.variant?.color?.name;
      const size = item.size ?? item.variant?.size?.name;
      const image = item.product?.base_images?.[0];
      const imageUrl = image
        ? image.startsWith("http")
          ? image
          : `${API_URL}/storage/${image.replace(/^\/+/, "")}`
        : null;
      return (
        <div className="flex min-w-[240px] items-center gap-3">
          {" "}
          {/* Product Image */}{" "}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
            {" "}
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={productName}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <Package className="h-6 w-6 text-muted-foreground" />
            )}{" "}
          </div>{" "}
          {/* Product Info */}{" "}
          <div className="min-w-0">
            {" "}
            <p className="truncate font-semibold text-foreground">
              {" "}
              {productName}{" "}
            </p>{" "}
            {(color || size) && (
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                {" "}
                {color && (
                  <span className="rounded-md bg-muted px-2 py-0.5">
                    {" "}
                    {color}{" "}
                  </span>
                )}{" "}
                {size && (
                  <span className="rounded-md bg-muted px-2 py-0.5">
                    {" "}
                    Size: {size}{" "}
                  </span>
                )}{" "}
              </div>
            )}{" "}
            {item.variant_sku && (
              <p className="mt-1 text-[11px] text-muted-foreground">
                {" "}
                SKU: {item.variant_sku}{" "}
              </p>
            )}{" "}
          </div>{" "}
        </div>
      );
    },
  },
  {
    header: "Qty",
    accessorKey: "quantity",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="min-w-10 justify-center rounded-md px-2.5 py-1 font-semibold"
      >
        {" "}
        ×{row.original.quantity}{" "}
      </Badge>
    ),
  },
  {
    header: "Unit Price",
    cell: ({ row }) => {
      const price = Number(row.original.unit_price);
      return (
        <span className="whitespace-nowrap font-medium">
          {" "}
          ${price.toFixed(2)}{" "}
        </span>
      );
    },
  },
  {
    header: "Total",
    cell: ({ row }) => {
      const total = Number(row.original.line_total);
      return (
        <Badge
          variant="secondary"
          className="whitespace-nowrap rounded-md px-3 py-1.5 font-semibold"
        >
          {" "}
          ${total.toFixed(2)}{" "}
        </Badge>
      );
    },
  },
];
