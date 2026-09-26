"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";

import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }: any) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
      />
    ),
    cell: ({ row }: any) => (
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
      />
    ),
  }
  ,
  {
    accessorKey: "id",
    header: "#Product ID",
    enableSorting: false,
    size: 4,
    cell: ({ row }: any) => (
      <Link href={`/products/${row.original.id}/edit`} className="font-medium text-blue-600 hover:underline">
        #{row.original.id}
      </Link>
    ),
  },
  {
    id: "name",
    header: "Name",
    accessorFn: (row: any) => row.translations[0].name ?? "",
    cell: (info: any) => info.getValue(),
  },
  {
    id: "is_active",
    header: "Active",
    accessorFn: (row: any) => row.is_active,
    enableSorting: false,
    cell: (info: any) => info.getValue() == 1 ? <span className="text-green-500">Active</span> : <span className="text-red-500">Inactive</span>,
  },
  {
    id: "product_preview",
    header: "Preview",
    cell: ({ row }: any) => {
      const product = row.original;
      const hasVariants = product.variants?.length > 0;


      return (
        <div className="flex items-start gap-3">
          {/* IMAGE */}
          <div className="relative h-12 w-12 shrink-0 rounded-md overflow-hidden border bg-muted">
            <Image
              src={
                hasVariants
                  ? `${process.env.NEXT_PUBLIC_BASE_API_URL}/storage/${product.variants[0]?.images?.[0]?.file_path}`
                  : `${process.env.NEXT_PUBLIC_BASE_API_URL}/storage/${product.base_images?.[0]}`
              }
              alt={product.translations[0].name}
              fill
              className="object-cover"
            />
          </div>


        </div>
      );
    },
  },

  {
    id: "variants",
    header: "Product Variants",
    cell: ({ row }: any) => {
      const product = row.original;
      const hasVariants = product.variants?.length > 0;

      return (
        <div className="flex items-start gap-3">
          {/* VARIANTS */}
          {hasVariants ? (
            <div className="space-y-1 text-xs text-muted-foreground">
              {product.variants.slice(0, 3).map((variant: any) => (
                <div
                  key={variant.id}
                  className="flex items-center gap-2"
                >
                  {/* Color */}
                  {variant.color && (
                    <span
                      className="h-3 w-3 rounded-full border"
                      style={{ backgroundColor: variant.color.hex }}
                    />
                  )}

                  {/* Size */}
                  {variant.size && (
                    <span className="uppercase">{variant.size.name}</span>
                  )}

                  {/* Price */}
                  <span>${variant.price}</span>

                  {/* Stock */}
                  <span
                    className={
                      variant.stock > 0
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    ({variant.stock})
                  </span>
                </div>
              ))}

              {product.variants.length > 3 && (
                <span className="text-xs italic">
                  +{product.variants.length - 3} more variants
                </span>
              )}
            </div>
          ) : (
            // BASE PRODUCT
            <p className="text-sm text-muted-foreground">
              Empty
            </p>
          )}
        </div>
      );
    },
  },
  {
    id: "price",
    accessorKey: "price",
    header: ({ column }: any) => (
      <button
        className="inline-flex font-medium"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        Price
      </button>
    ),

    // ✅ THIS enables sorting
    accessorFn: (row: any) => {
      if (row.variants?.length > 0) {
        return Math.min(
          ...row.variants.map((v: any) => Number(v.price))
        );
      }
      return Number(row.base_price ?? 0);
    },

    cell: ({ row }: any) => {
      const product = row.original;
      const variants = product.variants ?? [];

      if (variants.length > 0) {
        const prices = variants.map((v: any) => Number(v.price));
        const min = Math.min(...prices);
        const max = Math.max(...prices);

        return (
          <span className="font-medium">
            {min === max ? `$${min}` : `$${min} – $${max}`}
          </span>
        );
      }

      return (
        <span className="font-medium">
          ${product.base_price ?? "—"}
        </span>
      );
    },

    sortingFn: "basic", // optional, numeric works by default
  },
  {
    id: "actions",
    cell: ({ row }: any) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.id.toString())}
            >
              Copy product ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/products/${product.id}/edit`}>View product</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]

