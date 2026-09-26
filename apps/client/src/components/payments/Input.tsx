export default function Input({
  label,
  placeholder,
}: {
  label: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <input
        placeholder={placeholder}
        className="w-full border-b border-gray-200 
                   focus:border-slate-800 
                   outline-none py-2 transition"
      />
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 text-xs rounded-md bg-gray-100">{children}</span>
  );
}
