"use client";

import { motion } from "framer-motion";

const colors = ["bg-yellow-400", "bg-pink-400", "bg-blue-400", "bg-green-400"];

export default function Fireworks() {
    return (
        <>
            {Array.from({ length: 25 }).map((_, i) => (
                <motion.span
                    key={i}
                    className={`absolute w-2 h-2 rounded-full ${colors[i % colors.length]
                        }`}
                    initial={{
                        opacity: 0,
                        x: 0,
                        y: 0,
                        scale: 0,
                    }}
                    animate={{
                        opacity: [0, 1, 0],
                        x: Math.random() * 600 - 300,
                        y: Math.random() * -500,
                        scale: [0, 1, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        delay: Math.random(),
                        repeat: Infinity,
                        repeatDelay: 1,
                    }}
                    style={{
                        left: "50%",
                        top: "60%",
                    }}
                />
            ))}
        </>
    );
}
