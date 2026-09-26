"use client";

interface Props {
  value: string;
  onChange: (period: string) => void;
}

export default function PeriodFilter({
  value,
  onChange,
}: Props) {
  return (
    <div className="flex gap-2 justify-end mb-4">
      {["7d", "30d", "12m",'360d'].map((period) => (
        <button
          key={period}
          onClick={() => onChange(period)}
          className={`px-4 py-2 rounded-md border ${
            value === period
              ? "bg-primary text-primary-foreground"
              : ""
          }`}
        >
          {period}
        </button>
      ))}
    </div>
  );
}