export default function CODInfo() {
  return (
    <>
      <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
        You will pay in cash when the order is delivered to your address.
        {/* Submit */}
      </div>
      <button
        className="w-full mt-4 rounded-lg bg-slate-800 text-white py-3 
        hover:bg-slate-900 transition flex items-center 
        justify-center gap-2"
      >
        Checkout 🛒
      </button>
    </>
  );
}
