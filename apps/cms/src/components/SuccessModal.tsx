// components/SuccessModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = {
    open: boolean;
    title?: string;
    description?: string;
};

export default function SuccessModal({
    open,
    title = "Login Successful",
    description = "Welcome back! Redirecting to dashboard...",
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
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-[320px] text-center">
                            {/* Animated Icon */}
                            <div className="flex justify-center mb-4">
                                <motion.div
                                    className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 15,
                                    }}
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
                                            transition={{
                                                duration: 0.6,
                                                ease: "easeInOut",
                                            }}
                                        />
                                    </motion.svg>
                                </motion.div>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900">
                                {title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {description}
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
