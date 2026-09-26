export default function PaymentOption({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-sm font-medium dark:bg-gray-800 
        transition
        ${
          active
            ? "border-slate-800 bg-primary dark:bg-gray-600 text-secondary"
            : "border-gray-200 hover:border-gray-400"
        }`}
    >
      {label}
    </button>
  );
}
