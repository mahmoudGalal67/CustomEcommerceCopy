"use client";

import { useState } from "react";

import api from "@/utilis/axios";
import type { StripeCardNumberElementOptions } from "@stripe/stripe-js";

import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { cartApi } from "@/services/cartApi";

import { useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";

const elementStyle: StripeCardNumberElementOptions = {
  style: {
    base: {
      fontSize: "14px",
      color: "#111827",
      fontFamily: "Inter, system-ui, sans-serif",
      "::placeholder": {
        color: "#9CA3AF",
      },
    },
    invalid: {
      color: "#EF4444",
    },
  },
  showIcon: true,
  iconStyle: "solid",
};

const StripePayment = ({
  totalAmount,
  shippingData,
}: {
  totalAmount: number;
  shippingData: any;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [complete, setComplete] = useState({
    number: false,
    expiry: false,
    cvc: false,
  });
  const dispatch = useDispatch();
  const isFormComplete = complete.number && complete.expiry && complete.cvc;
  const params = useParams();
  const locale = (params.locale || "en") as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !isFormComplete) return;

    setLoading(true);

    try {
      const { data } = await api.post("/stripe/payment-intent", {
        ...shippingData,
        amount: totalAmount * 100,
      });

      const { client_secret } = data;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement)!,
        },
      });

      if (result.error) {
        setError(result.error.message ?? "Payment failed");
        return;
      }

      // ✅ PAYMENT SUCCESS
      dispatch(cartApi.util.invalidateTags(["Cart"]));
      router.push(`/${locale}/success`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white dark:bg-gray-600 p-6 rounded-2xl shadow"
    >
      <h2 className="text-lg font-semibold mb-4">Card information</h2>

      {/* Card Number */}
      <div className="border border-amber-400 rounded-t-xl px-4 py-3">
        <CardNumberElement
          options={elementStyle}
          onChange={(e) => {
            setComplete((c) => ({ ...c, number: e.complete }));
            setError(e.error ? e.error.message : null);
          }}
        />
      </div>

      {/* Expiry + CVC */}
      <div className="flex border border-amber-400 border-t-0 rounded-b-xl">
        <div className="w-1/2 px-4 py-3 border-r">
          <CardExpiryElement
            options={elementStyle}
            onChange={(e) => setComplete((c) => ({ ...c, expiry: e.complete }))}
          />
        </div>

        <div className="w-1/2 px-4 py-3">
          <CardCvcElement
            options={elementStyle}
            onChange={(e) => setComplete((c) => ({ ...c, cvc: e.complete }))}
          />
        </div>
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

      {/* Pay Button */}
      <button
        type="submit"
        disabled={!isFormComplete || loading}
        className="mt-6 w-full bg-gray-900 text-white py-3 rounded-xl disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Processing..." : `Pay $${totalAmount}`}
      </button>

      <p className="text-xs text-gray-400 text-center mt-3">
        Secured by Stripe 🔒
      </p>
    </form>
  );
};

export default StripePayment;
