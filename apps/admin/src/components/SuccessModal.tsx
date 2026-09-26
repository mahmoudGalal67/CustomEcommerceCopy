// components/SuccessModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    isLoading?: boolean;
};

export default function SuccessModal({
    open,
    onClose,
    title = "Login Successful",
    description = "Welcome back! Redirecting to dashboard...",
    isLoading = false,
}: Props) {
    const [openModal, setOpenModal] = useState(open)    // ⏱️ Auto-close ONLY after success

    useEffect(() => {
        if (open) setOpenModal(true);
    }, [open]);
    useEffect(() => {
        if (!openModal || isLoading) return;

        const timer = setTimeout(() => {
            setOpenModal(false);
            onClose();
        }, 1000);

        return () => clearTimeout(timer);
    }, [openModal, isLoading, onClose]);

    return (
        <AnimatePresence>
            {openModal && (
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
                                    {isLoading ? (
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
                                    ) : (
                                        // ✅ SUCCESS CHECK
                                        <motion.div
                                            key="success"
                                            className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                        >
                                            <motion.svg
                                                viewBox="0 0 24 24"
                                                className="w-7 h-7"
                                                fill="none"
                                                stroke="white"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <motion.path
                                                    d="M20 6L9 17l-5-5"
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                            </motion.svg>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* TEXT */}
                            <h3 className="text-lg font-semibold text-gray-900">
                                {isLoading ? "Processing..." : title}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                {isLoading ? "Please wait a moment" : description}
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
