// components/LoadingSpinner.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function LoadingSpinner({
    open,
    onClose,
}: Props) {
    // ⏱️ Auto-close ONLY after success
    useEffect(() => {
        if (!open) return;

        const timer = setTimeout(() => {
            onClose();
        }, 1000);

        return () => clearTimeout(timer);
    }, [open, onClose]);

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
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-[320px] text-center">

                            {/* ICON AREA */}
                            <div className="flex justify-center mb-4 h-16">
                                <AnimatePresence mode="wait">
                                    // 🔄 LOADING SPINNER
                                    <motion.div
                                        key="spinner"
                                        className="w-14 h-14 rounded-full border-4 border-gray-200 border-t-blue-500"
                                        initial={{ rotate: 0 }}
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1,
                                            ease: "linear",
                                        }}
                                    />

                                </AnimatePresence>
                            </div>

                            {/* TEXT */}
                            <h3 className="text-lg font-semibold text-gray-900">
                                Processing...
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                Please wait a moment
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
