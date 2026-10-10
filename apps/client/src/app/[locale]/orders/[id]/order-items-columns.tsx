"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type OrderItem = {
  id: number;
  quantity: number;
  unit_price: string;
  line_total: string;

  product?: { translations: { locale: string; name: string }[] };
  variant?: {
    product?: { translations: { locale: string; name: string }[] };
    color?: { name: string };
    size?: { name: string };
  } | null;
};

export const orderItemsColumns = (
  isArabic: boolean,
  locale: any,
): ColumnDef<OrderItem>[] => [
  {
    header: isArabic ? "المنتج" : "Product",
    cell: ({ row }: any) => {
      const item = row.original;
      const product = item.product;

      // Find current locale translation
      const translation = product?.translations?.find(
        (translation: any) => translation.locale === locale,
      );

      // Fallback to English
      const englishTranslation = product?.translations?.find(
        (translation: any) => translation.locale === "en",
      );

      const productName =
        translation?.name ??
        englishTranslation?.name ??
        (isArabic ? "منتج غير معروف" : "Unknown Product");

      const color = item.variant?.color?.name;
      const size = item.variant?.size?.name;

      return (
        <div className="flex flex-col">
          <span className="font-medium">{productName}</span>

          {(color || size) && (
            <span className="text-xs opacity-60">
              {[color, size].filter(Boolean).join(" / ")}
            </span>
          )}
        </div>
      );
    },
  },
  {
    header: isArabic ? "الكمية" : "Qty",
    accessorKey: "quantity",
  },
  {
    header: isArabic ? "سعر الوحدة" : "Unit Price",
    cell: ({ row }) => `$${row.original.unit_price}`,
  },
  {
    header: isArabic ? "الإجمالي" : "Total",
    cell: ({ row }) => (
      <Badge variant="secondary">${row.original.line_total}</Badge>
    ),
  },
];
