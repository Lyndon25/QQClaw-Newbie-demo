"use client";

import { motion } from "framer-motion";

interface BottomButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "success";
}

export default function BottomButton({
  text,
  onClick,
  disabled = false,
  variant = "primary",
}: BottomButtonProps) {
  const variantStyles = {
    primary: "bg-qq-primary hover:bg-qq-primary-dark",
    secondary: "bg-gray-500 hover:bg-gray-600",
    success: "bg-qq-success hover:bg-green-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
      className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-qq-border"
    >
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full py-3.5 rounded-2xl text-white font-semibold text-base transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]}`}
      >
        {text}
      </button>
    </motion.div>
  );
}
