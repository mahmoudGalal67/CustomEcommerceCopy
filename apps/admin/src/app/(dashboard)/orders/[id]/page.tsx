"use client";
import { useParams } from "next/navigation";
import { useGetOrderByIdQuery } from "@/services/orderApi";
import { orderItemsColumns } from "./order-items-columns";
import { OrderItemsTable } from "./order-items-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Loading from "../loading";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Receipt,
  Store,
  Package,
  CalendarDays,
} from "lucide-react";
const statusColors: Record<string, string> = {
  pending:
    "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  processing:
    "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400",
  shipped:
    "border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-400",
  completed:
    "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400",
  cancelled: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400",
  refunded:
    "border-gray-500/30 bg-gray-500/10 text-gray-700 dark:text-gray-400",
};
const paymentColors: Record<string, string> = {
  paid: "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400",
  unpaid:
    "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  failed: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400",
};
function StatusBadge({
  status,
  type = "order",
}: {
  status?: string;
  type?: "order" | "payment";
}) {
  if (!status) return null;
  const colors = type === "payment" ? paymentColors : statusColors;
  return (
    <Badge
      variant="outline"
      className={`capitalize ${colors[status] ?? "bg-muted"}`}
    >
      {" "}
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />{" "}
      {status}{" "}
    </Badge>
  );
}
function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex gap-3">
      {" "}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        {" "}
        <Icon className="h-4 w-4 text-muted-foreground" />{" "}
      </div>{" "}
      <div className="min-w-0">
        {" "}
        <p className="text-xs font-medium text-muted-foreground">
          {" "}
          {label}{" "}
        </p>{" "}
        <p className="mt-0.5 truncate text-sm font-medium">
          {" "}
          {value || "—"}{" "}
        </p>{" "}
      </div>{" "}
    </div>
  );
}
function PriceRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: number;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between ${bold ? "text-base font-bold" : "text-sm"}`}
    >
      {" "}
      <span className={bold ? "text-foreground" : "text-muted-foreground"}>
        {" "}
        {label}{" "}
      </span>{" "}
      <span>${value.toFixed(2)}</span>{" "}
    </div>
  );
}
export default function OrderDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetOrderByIdQuery(Number(id));
  if (isLoading) {
    return <Loading />;
  }
  if (isError || !data) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        {" "}
        <div className="text-center">
          {" "}
          <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />{" "}
          <h2 className="font-semibold">Unable to load order</h2>{" "}
          <p className="mt-1 text-sm text-muted-foreground">
            {" "}
            Something went wrong while loading this order.{" "}
          </p>{" "}
        </div>{" "}
      </div>
    );
  }
  /* * ADMIN RESPONSE: * * { * id: 4, * name: "...", * seller_orders: [...] * } * * SELLER RESPONSE: * * { * id: 3, * order_id: 4, * items: [...], * seller: {...}, * order: {...} * } */ const isSellerResponse =
    !!data.order;
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
  const subtotal = Number(order.subtotal ?? 0);
  const shipping = Number(order.shipping ?? 0);
  const tax = Number(order.tax ?? 0);
  const total = Number(order.total ?? subtotal + shipping + tax);
  const createdAt = order.created_at
    ? new Date(order.created_at).toLocaleDateString()
    : "—";
  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      {" "}
      {/* PAGE HEADER */}{" "}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {" "}
        <div>
          {" "}
          <div className="flex items-center gap-2">
            {" "}
            <h1 className="text-2xl font-bold tracking-tight">
              {" "}
              Order #{order.id}{" "}
            </h1>{" "}
            <StatusBadge status={order.status} />{" "}
          </div>{" "}
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            {" "}
            <CalendarDays className="h-4 w-4" />{" "}
            <span>Placed on {createdAt}</span>{" "}
          </div>{" "}
        </div>{" "}
        <StatusBadge status={order.payment_status} type="payment" />{" "}
      </div>{" "}
      {/* CUSTOMER + ORDER SUMMARY */}{" "}
      <div className="grid gap-6 lg:grid-cols-3">
        {" "}
        {/* CUSTOMER INFORMATION */}{" "}
        <Card className="lg:col-span-2">
          {" "}
          <CardHeader className="border-b">
            {" "}
            <div className="flex items-center gap-2">
              {" "}
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                {" "}
                <User className="h-4 w-4 text-primary" />{" "}
              </div>{" "}
              <div>
                {" "}
                <h2 className="font-semibold"> Customer Information </h2>{" "}
                <p className="text-xs text-muted-foreground">
                  {" "}
                  Shipping and contact details{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
          </CardHeader>{" "}
          <CardContent className="grid gap-6 pt-6 sm:grid-cols-2">
            {" "}
            <InfoItem icon={User} label="Customer" value={order.name} />{" "}
            <InfoItem icon={Mail} label="Email" value={order.email} />{" "}
            <InfoItem icon={Phone} label="Phone" value={order.phone} />{" "}
            <InfoItem icon={MapPin} label="City" value={order.city} />{" "}
            <div className="sm:col-span-2">
              {" "}
              <InfoItem
                icon={MapPin}
                label="Address"
                value={order.adress}
              />{" "}
            </div>{" "}
          </CardContent>{" "}
        </Card>{" "}
        {/* ORDER SUMMARY */}{" "}
        <Card>
          {" "}
          <CardHeader className="border-b">
            {" "}
            <div className="flex items-center gap-2">
              {" "}
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                {" "}
                <Receipt className="h-4 w-4 text-primary" />{" "}
              </div>{" "}
              <div>
                {" "}
                <h2 className="font-semibold"> Order Summary </h2>{" "}
                <p className="text-xs text-muted-foreground">
                  {" "}
                  Payment breakdown{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
          </CardHeader>{" "}
          <CardContent className="space-y-4 pt-6">
            {" "}
            <PriceRow label="Subtotal" value={subtotal} />{" "}
            <PriceRow label="Shipping" value={shipping} />{" "}
            <PriceRow label="Tax" value={tax} />{" "}
            <div className="border-t pt-4">
              {" "}
              <PriceRow label="Total" value={total} bold />{" "}
            </div>{" "}
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              {" "}
              <div className="flex items-center gap-2">
                {" "}
                <CreditCard className="h-4 w-4 text-muted-foreground" />{" "}
                <span className="text-sm">Payment</span>{" "}
              </div>{" "}
              <StatusBadge status={order.payment_status} type="payment" />{" "}
            </div>{" "}
          </CardContent>{" "}
        </Card>{" "}
      </div>{" "}
      {/* SELLER ORDERS */}{" "}
      <div className="space-y-5">
        {" "}
        <div>
          {" "}
          <h2 className="text-xl font-bold tracking-tight">
            {" "}
            Order Items{" "}
          </h2>{" "}
          <p className="text-sm text-muted-foreground">
            {" "}
            Products included in this order{" "}
          </p>{" "}
        </div>{" "}
        {sellerOrders.map((sellerOrder: any) => {
          const sellerSubtotal = (sellerOrder.items ?? []).reduce(
            (sum: number, item: any) => sum + Number(item.line_total ?? 0),
            0,
          );
          return (
            <Card key={sellerOrder.id} className="overflow-hidden">
              {" "}
              {/* SELLER HEADER */}{" "}
              <CardHeader className="border-b bg-muted/20">
                {" "}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {" "}
                  <div className="flex items-center gap-3">
                    {" "}
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border bg-background">
                      {" "}
                      <Store className="h-5 w-5 text-muted-foreground" />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <p className="text-xs font-medium text-muted-foreground">
                        {" "}
                        Seller{" "}
                      </p>{" "}
                      <h3 className="font-semibold">
                        {" "}
                        {sellerOrder.seller?.shop_name ?? "Unknown Seller"}{" "}
                      </h3>{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="flex items-center gap-3">
                    {" "}
                    <div className="hidden text-right sm:block">
                      {" "}
                      <p className="text-xs text-muted-foreground">
                        {" "}
                        Seller subtotal{" "}
                      </p>{" "}
                      <p className="font-semibold">
                        {" "}
                        ${sellerSubtotal.toFixed(2)}{" "}
                      </p>{" "}
                    </div>{" "}
                    <StatusBadge status={sellerOrder.status} />{" "}
                  </div>{" "}
                </div>{" "}
              </CardHeader>{" "}
              {/* ITEMS */}{" "}
              <CardContent className="p-0">
                {" "}
                <OrderItemsTable
                  data={sellerOrder.items ?? []}
                  columns={orderItemsColumns}
                />{" "}
              </CardContent>{" "}
            </Card>
          );
        })}{" "}
      </div>{" "}
      {/* FINAL TOTAL */}{" "}
      {!isSellerResponse && (
        <Card className="border-primary/20 bg-primary/[0.03]">
          {" "}
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            {" "}
            <div className="flex items-center gap-3">
              {" "}
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                {" "}
                <Truck className="h-5 w-5 text-primary" />{" "}
              </div>{" "}
              <div>
                {" "}
                <p className="font-semibold"> Order Total </p>{" "}
                <p className="text-sm text-muted-foreground">
                  {" "}
                  Including shipping and tax{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <p className="text-2xl font-bold"> ${total.toFixed(2)} </p>{" "}
          </CardContent>{" "}
        </Card>
      )}{" "}
    </div>
  );
}
