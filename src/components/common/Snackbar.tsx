import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useSnackbarStore } from "@/store/useSnackbarStore";

export default function Snackbar() {
  const { isOpen, message, type, hideSnackbar } = useSnackbarStore();

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(hideSnackbar, 2500);
      return () => clearTimeout(t);
    }
  }, [isOpen, hideSnackbar]);

  const bg = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={`fixed bottom-0 left-1/2 -translate-x-1/2 rounded-xl px-6 py-3 text-white shadow-lg ${bg}`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
