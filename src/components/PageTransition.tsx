"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "down";
}

export default function PageTransition({
  children,
  direction = "right",
}: PageTransitionProps) {
  const directionOffset = {
    left: { x: -300, y: 0 },
    right: { x: 300, y: 0 },
    up: { x: 0, y: -300 },
    down: { x: 0, y: 300 },
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: directionOffset[direction].x,
        y: directionOffset[direction].y,
      }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{
        opacity: 0,
        x: -directionOffset[direction].x,
        y: -directionOffset[direction].y,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}
