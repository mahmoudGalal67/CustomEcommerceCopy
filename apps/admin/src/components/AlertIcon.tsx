// components/AlertIcon.tsx
"use client";

import { motion } from "framer-motion";

export default function AlertIcon() {
    return (
        <motion.div
            className="w-14 h-14 rounded-full bg-yellow-500 flex items-center justify-center"
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
                    d="M12 9v4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                />
                <motion.path
                    d="M12 17h.01"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                />
            </motion.svg>
        </motion.div>
    );
}
