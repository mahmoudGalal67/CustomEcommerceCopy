"use client";

import { PaymentFormInputs, paymentFormSchema } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import FormField from "./FormField";
import PaymentMethodSelector from "./PaymentMethodSelector";
import StripePayment from "./StripePayment";

const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const formatExpiry = (value: string) => {
  const clean = value.replace(/\D/g, "").slice(0, 4);
  if (clean.length < 3) return clean;
  return `${clean.slice(0, 2)}/${clean.slice(2)}`;
};

const PaymentForm = ({
  shippingData,
  totalAmount,
}: {
  totalAmount: number;
  shippingData: any;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<PaymentFormInputs>({
    resolver: zodResolver(paymentFormSchema),
    mode: "onChange",
    defaultValues: {
      paymentMethod: "stripe",
    },
  });

  const method = watch("paymentMethod");

  const handlePaymentForm: SubmitHandler<PaymentFormInputs> = (data) => {
    if (data.paymentMethod === "paypal") {
      console.log("Redirect to PayPal");
    }

    if (data.paymentMethod === "stripe") {
      console.log("Stripe payment", data);
    }

    if (data.paymentMethod === "visa") {
      console.log("Visa payment", data);
    }
  };
  return (
    <>
      {/* Payment Method */}
      <PaymentMethodSelector
        value={method}
        onChange={(v) => setValue("paymentMethod", v, { shouldValidate: true })}
      />

      {method === "stripe" && (
        <StripePayment totalAmount={totalAmount} shippingData={shippingData} />
      )}
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(handlePaymentForm)}
      >
        {/* Card Form (Stripe) */}
        {/* Card Form (Visa) */}
        {method === "visa" && (
          <>
            <FormField label="Name on card" error={errors.cardHolder?.message}>
              <input
                {...register("cardHolder")}
                className="border-b border-gray-200 py-2 outline-none text-sm"
              />
            </FormField>

            <FormField label="Card Number" error={errors.cardNumber?.message}>
              <input
                className="border-b border-gray-200 py-2 outline-none text-sm"
                onChange={(e) =>
                  setValue("cardNumber", formatCardNumber(e.target.value), {
                    shouldValidate: true,
                  })
                }
              />
            </FormField>

            <FormField
              label="Expiration Date"
              error={errors.expirationDate?.message}
            >
              <input
                className="border-b border-gray-200 py-2 outline-none text-sm"
                onChange={(e) =>
                  setValue("expirationDate", formatExpiry(e.target.value), {
                    shouldValidate: true,
                  })
                }
              />
            </FormField>

            <FormField label="CVV" error={errors.cvv?.message}>
              <input
                className="border-b border-gray-200 py-2 outline-none text-sm"
                onChange={(e) =>
                  setValue("cvv", e.target.value.replace(/\D/g, ""), {
                    shouldValidate: true,
                  })
                }
              />
            </FormField>
          </>
        )}

        {/* PayPal Notice */}
        {method === "paypal" && (
          <div className="bg-gray-50 text-sm text-gray-600 p-4 rounded-lg">
            You will be redirected to PayPal to complete your payment securely.
          </div>
        )}

        {/* Accepted Cards */}
        <div className="flex items-center gap-2 mt-4">
          <Image src="/cards.png" alt="cards" width={60} height={25} />
          <Image src="/paypal.png" alt="klarna" width={60} height={25} />
          <Image src="/stripe.png" alt="stripe" width={60} height={25} />
          <Image
            src="/vodafonecash.jpg"
            alt="vodafonecash"
            width={60}
            height={25}
          />
          <Image src="/cash.png" alt="stripe" width={60} height={25} />
        </div>

      </form>
    </>
  );
};

export default PaymentForm;
