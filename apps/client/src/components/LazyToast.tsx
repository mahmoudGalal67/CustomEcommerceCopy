// components/LazyToast.tsx
"use client";
import dynamic from "next/dynamic";
const ToastContainer = dynamic(
  () => import("react-toastify").then((m) => m.ToastContainer),
  { ssr: false },
);
export default function LazyToast() {
  return <ToastContainer position="bottom-right" />;
}
