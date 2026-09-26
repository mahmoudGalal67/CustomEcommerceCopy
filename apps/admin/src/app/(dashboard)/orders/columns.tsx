import Link from "next/link";
import StatusCell from "@/components/StatusCell";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, Store } from "lucide-react";
import { cn } from "@/lib/utils";

export type Order = {
  id: number;
  subtotal: number;
  order_id: number;
  status: "processing" | "completed" | "cancelled";
  order: {
    name: string;
    email: string;
    phone: string;
    city: string;
    payment_status: "paid" | "pending" | "failed";
  };
  items: { id: number; variant: { product: { name: string } } }[];
};

const sellerOrderColumns = [
  {
    accessorKey: "order_id",
    header: "#Order ID",

    cell: ({ row }: any) => (
      <Link
        href={`/orders/${row.original.order_id}`}
        className="font-medium text-blue-600 hover:underline"
      >
        #{row.original.order_id}
      </Link>
    ),
  },
  {
    id: "order_name",
    header: "Name",
    accessorFn: (row: any) => row?.order.name ?? "",
    cell: (info: any) => info.getValue(),
  },

  {
    id: "order_email",
    header: "Email",
    accessorFn: (row: any) => row?.order.email ?? "",
    cell: (info: any) => info.getValue(),
  },

  {
    id: "order_phone",
    header: "Phone",
    accessorFn: (row: any) => row?.order.phone ?? "",
    cell: (info: any) => info.getValue(),
  },

  {
    id: "order_city",
    header: "City",
    accessorFn: (row: any) => row?.order.city ?? "",
    cell: (info: any) => info.getValue(),
  },
  {
    id: "sellerOrder",
    header: "Items",
    enableSorting: false,

    cell: ({ row }: any) => {
      const sellerOrder = row.original;

      return (
        <div className="min-w-[280px]">
          <Collapsible className="border rounded-lg">
            <CollapsibleTrigger asChild>
              <button className="flex w-full items-center justify-between p-3 hover:bg-muted/50 transition">
                <div>
                  <h3>{sellerOrder.seller?.shop_name ?? "Unknown Customer"}</h3>
                  <p className="text-xs text-muted-foreground">
                    {sellerOrder.items?.length ?? 0} item(s)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span>{sellerOrder.status}</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </button>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="border-t p-3 space-y-2">
                {sellerOrder.items?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {item.variant?.product?.translations?.[0]?.name ??
                          item.product?.translations?.[0]?.name ??
                          "Unknown Product"}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <div className="text-sm font-semibold">
                      ${item.line_total}
                    </div>
                  </div>
                ))}

                <div className="flex justify-between border-t pt-2 font-medium">
                  <span>Total</span>
                  <span>${sellerOrder.subtotal}</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      );
    },
  },
  {
    id: "payment",
    header: "Payment Status",
    accessorFn: (row: any) => row?.order.payment_status ?? "",
    cell: (info: any) => (
      <div
        className={cn(
          "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
          {
            "bg-green-100 text-green-800": info.getValue() === "paid",
            "bg-yellow-100 text-yellow-800": info.getValue() === "unpaid",
            "bg-red-100 text-red-800": info.getValue() === "failed",
          },
        )}
      >
        {info.getValue()}
      </div>
    ),
  },
];

const adminOrderColumns = [
  {
    accessorKey: "order_id",
    header: "#Order ID",

    cell: ({ row }: any) => (
      <Link
        href={`/orders/${row.original.id}`}
        className="font-medium text-blue-600 hover:underline"
      >
        #{row.original.id}
      </Link>
    ),
  },
  {
    id: "order_name",
    header: "Name",
    accessorFn: (row: any) => row.name ?? "",
    cell: (info: any) => info.getValue(),
  },

  {
    id: "order_email",
    header: "Email",
    accessorFn: (row: any) => row.email ?? "",
    cell: (info: any) => info.getValue(),
  },

  {
    id: "order_phone",
    header: "Phone",
    accessorFn: (row: any) => row.phone ?? "",
    cell: (info: any) => info.getValue(),
  },

  {
    id: "order_city",
    header: "City",
    accessorFn: (row: any) => row.city ?? "",
    cell: (info: any) => info.getValue(),
  },
  {
    id: "allOrders",
    header: "Sellers & Items",
    enableSorting: false,

    cell: ({ row }: any) => {
      const sellerOrders = row.original.seller_orders ?? [];

      return (
        <div className="space-y-2 min-w-[280px]">
          {sellerOrders.map((sellerOrder: any) => (
            <Collapsible key={sellerOrder.id} className="border rounded-lg">
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center justify-between p-3 hover:bg-muted/50 transition">
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4" />

                    <div>
                      <p className="font-medium text-left">
                        {sellerOrder.seller?.shop_name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {sellerOrder.items?.length ?? 0} item(s)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>{sellerOrder.status}</span>

                    <ChevronRight className="h-4 w-4" />
                  </div>
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="border-t p-3 space-y-2">
                  {sellerOrder.items?.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {item.variant?.product?.translations?.[0]?.name ??
                            item.product?.translations?.[0]?.name ??
                            "Unknown Product"}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <div className="text-sm font-semibold">
                        ${item.line_total}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between border-t pt-2 font-medium">
                    <span>Seller Total</span>
                    <span>${sellerOrder.subtotal}</span>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      );
    },
  },
];

const commonColumns = [
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
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: StatusCell,
    enableSorting: false,
  },
];

export const getColumns = (role?: string) => {
  if (role === "admin") {
    return [...commonColumns, ...adminOrderColumns];
  }

  if (role === "seller") {
    return [...commonColumns, ...sellerOrderColumns];
  }

  return commonColumns;
};
