"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface NavbarProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightContent?: React.ReactNode;
}

export default function Navbar({
  title,
  showBack = true,
  onBack,
  rightContent,
}: NavbarProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between px-4 py-3 bg-qq-primary text-white shrink-0 z-10"
    >
      <div className="w-8">
        {showBack && (
          <button
            onClick={handleBack}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
      </div>
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="w-8 flex justify-end">{rightContent}</div>
    </motion.div>
  );
}
