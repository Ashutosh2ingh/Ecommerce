// src/components/Successful.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

interface SuccessfulProps {
  isOpen: boolean;
  isClosing: boolean;
  onClose: () => void;
}

const OrderSuccessful: React.FC<SuccessfulProps> = ({ isOpen, isClosing, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-green-500 bg-opacity-50"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1 },
            closing: { opacity: 0 }, 
          }}
          initial="hidden"
          animate={isClosing ? "closing" : "show"}
          transition={{ duration: 0.2 }}
          exit={{ opacity: 0 }}
        >
          <div className="w-3/4 lg:w-2/4 max-h-[90vh] overflow-y-auto scrollbar-hide rounded-3xl bg-white p-6">
            <h2 className="text-2xl font-bold text-center text-green-500">
              Order Placed Successfully
            </h2>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderSuccessful;