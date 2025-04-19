"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/app/store/useAuthStore"; // Adjust import path as needed

const ErrorModal = () => {
  const { error, showErrorModal, dismissErrorModal } = useAuthStore();
  
  // Using AnimatePresence for proper exit animations
  return (
    <AnimatePresence>
      {showErrorModal && error && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <h3 className="text-xl font-semibold mb-2">Error</h3>
            <p className="text-gray-700 mb-4">{error}</p>
            <div className="flex justify-end">
              <button
                onClick={() => dismissErrorModal()}
                className="bg-mainGreen text-white font-medium py-2 px-4 rounded transition duration-150"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorModal;