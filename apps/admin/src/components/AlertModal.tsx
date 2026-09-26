// components/AlertModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import AlertIcon from "./AlertIcon";

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
};

export default function AlertModal({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 w-85 text-center">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <AlertIcon />
              </div>

              {/* Text */}
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

              <p className="text-sm text-gray-500 mt-2">{description}</p>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={onCancel}
                  className="flex-1 rounded-xl border border-gray-300 py-2 text-sm text-blue-500 cursor-pointer hover:bg-gray-50 transition"
                >
                  {cancelText}
                </button>

                <button
                  onClick={onConfirm}
                  className="flex-1 rounded-xl bg-yellow-500 text-white py-2 text-sm cursor-pointer hover:bg-yellow-600 transition"
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
