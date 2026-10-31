"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import Fireworks from "@/components/Fireworks";
import { useParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const params = useParams();
  const locale = (params.locale || "en") as string;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-secondary via-secondary-600 to-primary">
      {/* Fireworks */}
      <Fireworks />

      {/* Card */}
      <div className="payment-success-card relative z-10 w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-2xl">
        {/* Icon */}
        <div className="payment-success-icon mb-6 flex justify-center">
          <div className="rounded-full bg-green-500 p-4">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900">
          Payment Successful 🎉
        </h1>

        <p className="mt-3 text-gray-600">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        {/* Divider */}
        <div className="my-6 h-px bg-gray-200" />

        {/* Button */}
        <Link
          href={`/${locale}/orders`}
          className="payment-success-button block w-full cursor-pointer rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-700"
        >
          Go to My Orders →
        </Link>

        {/* Small note */}
        <p className="mt-4 text-xs text-gray-400">
          You will also receive a confirmation email 📧
        </p>
      </div>

      <style jsx>{`
        .payment-success-card {
          animation: cardEnter 600ms ease-out both;
        }

        .payment-success-icon {
          animation: iconEnter 500ms 200ms ease-out both;
        }

        .payment-success-button {
          transition:
            transform 150ms ease,
            background-color 200ms ease;
        }

        .payment-success-button:hover {
          transform: scale(1.05);
        }

        .payment-success-button:active {
          transform: scale(0.95);
        }

        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes iconEnter {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .payment-success-card,
          .payment-success-icon {
            animation: none;
          }

          .payment-success-button {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
