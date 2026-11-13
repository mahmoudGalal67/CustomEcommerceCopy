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
      className={`rounded-lg border md:px-3 md:py-2 p-2 md:text-sm text-[10px] font-medium dark:bg-gray-800 
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
