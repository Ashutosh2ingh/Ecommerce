import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '@/lib/variants';

interface OrderDetailsProps {
    isOpen: boolean;
    onClose: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ isOpen, onClose }) => {

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                    variants={fadeIn('up', 0.2)}
                    initial="hidden"
                    animate="show"
                    viewport={{ once: false, amount: 0.2 }}
                >
                    <div className="w-3/4 lg:w-2/4 max-h-[90vh] overflow-y-auto scrollbar-hide rounded-3xl">
                        <div className="bg-gray-100 p-6 rounded-lg shadow-md ">
                            <div className="mb-8">
                                <h4 className="h2 font-semibold mb-2 text-accent text-center"
                                >
                                    Order Details
                                </h4>
                                <h3 className='h5 font-semibold mb-4 text-ashu text-center'>sdfsadf</h3>
                                
                                <motion.p
                                    variants={fadeIn('up', 0.8)}
                                    initial="hidden"
                                    whileInView={'show'}
                                    viewport={{ once: false, amount: 0.3 }}
                                    className="mt-2 text-center w-[30px] bg-ashu hover:text-white hover:bg-accent rounded-full"
                                >
                                    <button onClick={onClose} type='button'>
                                        <span className='font-bold'>&larr;</span>
                                    </button>
                                </motion.p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OrderDetails;
