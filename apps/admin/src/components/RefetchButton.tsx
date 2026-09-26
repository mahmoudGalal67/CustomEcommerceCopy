// components/RefetchButton.tsx
"use client";

import { motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";

type Props = {
    onClick: () => void;
    isRefetching?: boolean;
    disabled?: boolean;
};

export default function RefetchButton({
    onClick,
    isRefetching = false,
    disabled = false,
}: Props) {
    return (
        <motion.button
            onClick={onClick}
            disabled={disabled || isRefetching}
            className={`
        inline-flex items-center justify-center
        w-9 h-9 rounded-full
        border border-gray-300
        text-gray-600
        hover:bg-gray-100
        active:scale-95
        transition
        disabled:opacity-50
        cursor-pointer
      `}
            whileTap={{ scale: 0.9 }}
        >
            <motion.div
                animate={{
                    rotate: isRefetching ? 360 : 0,
                }}
                transition={{
                    repeat: isRefetching ? Infinity : 0,
                    duration: 1,
                    ease: "linear",
                }}
            >
                <RefreshCcw size={18} />
            </motion.div>
        </motion.button>
    );
}
