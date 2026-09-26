"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import Fireworks from "@/components/Fireworks";
import { useParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const params = useParams();
  const locale = (params.locale || "en") as string;
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-secondary via-secondary-600 to-primary flex items-center justify-center overflow-hidden">
      {/* 🎆 Fireworks */}
      <Fireworks />

      {/* Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative z-10 bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="flex justify-center mb-6"
        >
          <div className="bg-green-500 p-4 rounded-full">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </motion.div>

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
        <Link href={`/${locale}/orders`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 rounded-xl bg-indigo-600 cursor-pointer text-white font-semibold shadow-lg hover:bg-indigo-700 transition"
          >
            Go to My Orders →
          </motion.button>
        </Link>

        {/* Small note */}
        <p className="mt-4 text-xs text-gray-400">
          You will also receive a confirmation email 📧
        </p>
      </motion.div>
    </div>
  );
}
