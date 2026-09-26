"use client";

import { useState } from "react";
import CardForm from "./payments/CardForm";
import VodafoneForm from "./payments/VodafoneForm";
import CODInfo from "./payments/CODInfo";
import PaymentOption from "./payments/PaymentOption";
import StripeProvider from "@/providers/StripeProvider";

type PaymentMethod = "card" | "vodafone" | "cod";

export default function PaymentSection({
  totalAmount,
  shippingData,
  locale,
}: {
  totalAmount: number;
  shippingData: any;
  locale: any;
}) {
  const [method, setMethod] = useState<PaymentMethod>("card");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6 space-y-6">
      {/* Payment Methods */}
      <div className="grid grid-cols-3 gap-3 ">
        <PaymentOption
          active={method === "card"}
          onClick={() => setMethod("card")}
          label={locale == "ar" ? "بطاقة" : "Card"}
        />
        <PaymentOption
          active={method === "vodafone"}
          onClick={() => setMethod("vodafone")}
          label={locale == "ar" ? "فودافون كاش" : "Vodafone Cash"}
        />
        <PaymentOption
          active={method === "cod"}
          onClick={() => setMethod("cod")}
          label={locale == "ar" ? "الدفع عند الاستلام" : "Cash on Delivery"}
        />
      </div>

      {/* Forms */}
      {method === "card" && (
        <StripeProvider>
          <CardForm totalAmount={totalAmount} shippingData={shippingData} />
        </StripeProvider>
      )}
      {method === "vodafone" && <VodafoneForm />}
      {method === "cod" && <CODInfo />}
    </div>
  );
}
