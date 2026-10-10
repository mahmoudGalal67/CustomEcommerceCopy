"use client";

import { useParams } from "next/navigation";
import { useGetOrderQuery } from "@/services/orderApi";
import { orderItemsColumns } from "./order-items-columns";
import { OrderItemsTable } from "./order-items-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Mail, Phone, User } from "lucide-react";

export default function OrderDetailsPage() {
  const { id, locale } = useParams();

  const isArabic = locale === "ar";

  const { data, isLoading, isError } = useGetOrderQuery(Number(id));

  console.log("Order details data:", data);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/15 text-yellow-700 border-yellow-500/20",
    processing: "bg-blue-500/15 text-blue-700 border-blue-500/20",
    shipped: "bg-purple-500/15 text-purple-700 border-purple-500/20",
    completed: "bg-green-500/15 text-green-700 border-green-500/20",
    cancelled: "bg-red-500/15 text-red-700 border-red-500/20",
    refunded: "bg-gray-500/15 text-gray-700 border-gray-500/20",
  };

  const paymentColors: Record<string, string> = {
    paid: "bg-green-500/15 text-green-700 border-green-500/20",
    unpaid: "bg-yellow-500/15 text-yellow-700 border-yellow-500/20",
    failed: "bg-red-500/15 text-red-700 border-red-500/20",
  };

  const statusTranslations: Record<string, string> = {
    pending: isArabic ? "قيد الانتظار" : "Pending",
    processing: isArabic ? "قيد المعالجة" : "Processing",
    shipped: isArabic ? "تم الشحن" : "Shipped",
    completed: isArabic ? "مكتمل" : "Completed",
    cancelled: isArabic ? "ملغي" : "Cancelled",
    refunded: isArabic ? "تم الاسترداد" : "Refunded",
  };

  const paymentTranslations: Record<string, string> = {
    paid: isArabic ? "مدفوع" : "Paid",
    unpaid: isArabic ? "غير مدفوع" : "Unpaid",
    failed: isArabic ? "فشل الدفع" : "Failed",
  };

  if (isLoading) {
    return (
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="flex min-h-[300px] items-center justify-center"
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>{isArabic ? "جاري تحميل الطلب..." : "Loading order..."}</span>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="flex min-h-[300px] items-center justify-center"
      >
        <Card className="w-full max-w-md">
          <CardContent className="py-8 text-center">
            <p className="font-medium text-destructive">
              {isArabic ? "حدث خطأ أثناء تحميل الطلب" : "Error loading order"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  /*
   * Admin response:
   * data.id
   * data.name
   * data.seller_orders
   *
   * Seller response:
   * data.order.id
   * data.order.name
   * data.items
   * data.seller
   */

  const isSellerResponse = !!data.order;

  const order = isSellerResponse ? data.order : data;

  const sellerOrders = isSellerResponse
    ? [
        {
          id: data.id,
          seller: data.seller,
          status: data.status,
          items: data.items,
        },
      ]
    : (data.seller_orders ?? []);

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="mx-auto w-full max-w-7xl space-y-6 pb-8"
    >
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isArabic ? "تفاصيل الطلب" : "Order Details"}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {isArabic
              ? `معلومات الطلب رقم #${order.id}`
              : `Information about order #${order.id}`}
          </p>
        </div>

        <Badge
          variant="outline"
          className={`w-fit px-3 py-1 text-sm ${
            statusColors[order.status] ?? ""
          }`}
        >
          {statusTranslations[order.status] ?? order.status}
        </Badge>
      </div>

      {/* ORDER INFO */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                {isArabic ? "معلومات الطلب" : "Order Information"}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {isArabic ? "الطلب" : "Order"} #{order.id}
              </p>
            </div>

            <Badge className={`border ${statusColors[order.status] ?? ""}`}>
              {statusTranslations[order.status] ?? order.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* CUSTOMER */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {isArabic ? "بيانات العميل" : "Customer Information"}
              </h3>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <InfoItem
                  icon={<User className="h-4 w-4" />}
                  label={isArabic ? "الاسم" : "Name"}
                  value={order.name}
                />

                <InfoItem
                  icon={<Mail className="h-4 w-4" />}
                  label={isArabic ? "البريد الإلكتروني" : "Email"}
                  value={order.email}
                />

                <InfoItem
                  icon={<Phone className="h-4 w-4" />}
                  label={isArabic ? "رقم الهاتف" : "Phone"}
                  value={order.phone}
                />

                <InfoItem
                  icon={<MapPin className="h-4 w-4" />}
                  label={isArabic ? "المدينة" : "City"}
                  value={order.city}
                />
              </div>

              {order.adress && (
                <InfoItem
                  icon={<MapPin className="h-4 w-4" />}
                  label={isArabic ? "العنوان" : "Address"}
                  value={order.adress}
                />
              )}
            </div>

            {/* PAYMENT */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {isArabic ? "ملخص الدفع" : "Payment Summary"}
              </h3>

              <div className="rounded-xl border bg-muted/20 p-4">
                <div className="space-y-3">
                  <SummaryRow
                    label={isArabic ? "المجموع الفرعي" : "Subtotal"}
                    value={`$${order.subtotal}`}
                  />

                  <SummaryRow
                    label={isArabic ? "الشحن" : "Shipping"}
                    value={`$${order.shipping ?? "0.00"}`}
                  />

                  {order.tax !== undefined && (
                    <SummaryRow
                      label={isArabic ? "الضريبة" : "Tax"}
                      value={`$${order.tax}`}
                    />
                  )}

                  <div className="border-t pt-3">
                    <SummaryRow
                      label={isArabic ? "الإجمالي" : "Total"}
                      value={`$${order.total ?? order.subtotal}`}
                      bold
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {isArabic ? "حالة الدفع:" : "Payment:"}
                  </span>

                  <Badge
                    className={`border ${
                      paymentColors[order.payment_status] ?? ""
                    }`}
                  >
                    {paymentTranslations[order.payment_status] ??
                      order.payment_status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SELLER ORDERS */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">
            {isArabic ? "المنتجات المطلوبة" : "Ordered Products"}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {isArabic
              ? "تفاصيل المنتجات الموجودة في هذا الطلب"
              : "Details of the products included in this order"}
          </p>
        </div>

        {sellerOrders.map((sellerOrder: any) => (
          <Card key={sellerOrder.id} className="overflow-hidden">
            <CardHeader className="border-b bg-muted/20">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {isArabic ? "البائع" : "Seller"}
                  </p>

                  <h3 className="mt-1 text-base font-semibold">
                    {sellerOrder.seller?.shop_name ??
                      (isArabic ? "بائع غير معروف" : "Unknown Seller")}
                  </h3>
                </div>

                <Badge
                  className={`w-fit border ${
                    statusColors[sellerOrder.status] ?? ""
                  }`}
                >
                  {statusTranslations[sellerOrder.status] ?? sellerOrder.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6">
              <OrderItemsTable
                data={sellerOrder.items ?? []}
                columns={orderItemsColumns(isArabic, locale)}
              />
            </CardContent>
          </Card>
        ))}

        {sellerOrders.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              {isArabic
                ? "لا توجد منتجات في هذا الطلب"
                : "No products found in this order"}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Reusable UI components              */
/* ---------------------------------- */

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 break-words text-sm font-medium">{value || "-"}</p>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 ${
        bold ? "text-base font-bold" : "text-sm"
      }`}
    >
      <span className={bold ? "" : "text-muted-foreground"}>{label}</span>

      <span className="whitespace-nowrap">{value}</span>
    </div>
  );
}
