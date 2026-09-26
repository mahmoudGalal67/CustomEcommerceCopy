export default function PaymentMethodSelector({
  value,
  onChange,
}: {
  value: "stripe" | "visa" | "paypal";
  onChange: (v: "stripe" | "visa" | "paypal") => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-4 ">
      <MethodButton
        label="Stripe"
        image="/stripe.png"
        active={value === "stripe"}
        onClick={() => onChange("stripe")}
      />
      <MethodButton
        label="Visa"
        image="/cards.png"
        active={value === "visa"}
        onClick={() => onChange("visa")}
      />
      <MethodButton
        label="PayPal"
        image="/paypal.png"
        active={value === "paypal"}
        onClick={() => onChange("paypal")}
      />
    </div>
  );
}

function MethodButton({
  label,
  image,
  active,
  onClick,
}: {
  label: string;
  image: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border rounded-lg p-3 flex items-center justify-center gap-2 transition
        ${
          active
            ? "border-gray-800 dark:bg-gray-600 bg-primary text-secondary"
            : "border-gray-200 hover:border-gray-400"
        }`}
    >
      <img src={image} alt={label} className="h-5" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
