"use client";

import React, { useEffect, useState } from "react";
import { ordersApi } from "@/utilis/api";
import StatusBadge from "@/components/StatusBadge ";
import PaymentBadge from "@/components/PaymentBadge";
import Link from "next/link";
import { useParams } from "next/navigation";

type Order = {
  id: number;
  name: string | null;
  email: string | null;
  phone: string;
  adress: string;
  payment_intent_id: number | null;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  payment_status: string;
};

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const locale = (params.locale || "en") as string;

  useEffect(() => {
    const getOrders = async () => {
      try {
        const { data } = await ordersApi.getOrders();
        setOrders(data);
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading orders...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Orders</h2>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-primary text-popover ">
            <tr>
              {[
                "Name",
                "Email",
                "Phone",
                "Address",
                "Billing ID",
                "Subtotal",
                "Shipping",
                "Tax",
                "Total",
                "Status",
                "Payment",
              ].map((head) => (
                <th
                  key={head}
                  className="px-4 py-3 text-left  font-medium whitespace-nowrap"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y-2 divide-amber-300">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-muted transition h-15">
                <Link
                  href={`/${locale}/orders/${order.id}`}
                  className="flex items-center h-15"
                >
                  <td className="px-4 py-2 ">{order.name ?? "-"}</td>
                </Link>
                <td className="px-4 py-2 ">{order.email ?? "-"}</td>
                <td className="px-4 py-2 ">{order.phone}</td>
                <td className="px-4 py-2  max-w-[200px] truncate">
                  {order.adress}
                </td>
                <td className="px-4 py-2  text-center">
                  {order.payment_intent_id ?? "-"}
                </td>

                <td className="px-4 py-2  font-medium">${order.subtotal}</td>
                <td className="px-4 py-2 ">${order.shipping}</td>
                <td className="px-4 py-2 ">${order.tax}</td>
                <td className="px-4 py-2  font-medium">${order.total}</td>
                <td className="px-4 py-2 ">
                  <StatusBadge value={order.status} />
                </td>
                <td className="px-4 py-2 ">
                  <PaymentBadge value={order.payment_status} />
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan={12} className="text-center py-6 ">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
