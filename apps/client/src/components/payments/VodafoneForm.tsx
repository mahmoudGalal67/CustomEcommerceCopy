import Input from "./Input";

export default function VodafoneForm() {
  return (
    <div className="space-y-4">
      <Input label="Vodafone Cash Number" placeholder="01XXXXXXXXX" />
      <p className="text-sm text-gray-500">
        You will receive a payment request on your Vodafone Cash wallet.
      </p>

      <button
        className="w-full mt-4 rounded-lg bg-slate-800 text-white py-3 
        hover:bg-slate-900 transition flex items-center 
        justify-center gap-2"
      >
        Checkout 🛒
      </button>
    </div>
  );
}
