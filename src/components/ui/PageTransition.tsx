import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Page transition wrapper using Framer Motion
 * Provides smooth transitions between pages
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const router = useRouter();

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 1.02,
    },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4,
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={router.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Loading page transition component
 */
export const LoadingTransition: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </motion.div>
  );
};