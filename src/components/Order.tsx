import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '@/lib/variants';

interface OrderDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: number | null;
}

interface Product {
    id: number;
    product_name: string;
    color: { color: string };
    size: { size: string };
}

interface Payment {
    razorpay_payment_id: string;
    payment_status: string;
    payment_date: string;
}

interface OrderItem {
    order_id: number;
    product_variation: Product;
    payment: Payment;
    quantity: number;
    total_amount: number;
    order_status: string;
    order_date: string;
}

const orderStatuses = ["Processing", "Shipped", "Out For Delivery", "Delivered", "Cancelled"];

const OrderDetails: React.FC<OrderDetailsProps> = ({ isOpen, onClose, orderId }) => {

    const [orderDetails, setOrderDetails] = useState<OrderItem | null>(null); 
    const token = localStorage.getItem("token");

    // Fetch specific order details by order ID
    const fetchOrderDetails = async (orderId: number) => {
        const response = await fetch(`http://127.0.0.1:8000/order/${orderId}/`, {
            method: 'GET',
            headers: {
                Authorization: `Token ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            setOrderDetails(data.data);
        }
    };

    useEffect(() => {
        if (orderId !== null) {
            fetchOrderDetails(orderId);
        }
    }, [orderId]);

    // Progress bar logic
    const getStatusIndex = (status: string) => {
        return orderStatuses.indexOf(status);
    };

    return (
        <AnimatePresence>
            {isOpen && orderDetails && (
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

                                {/* Order Information */}
                                <div className="mb-4">
                                    <h3 className="h5 font-semibold mb-4 text-center">
                                        {orderDetails.product_variation.product_name}
                                    </h3>
                                    <p className="text-center">
                                        Payment Status: {orderDetails.payment.payment_status}<br />
                                        Razorpay ID: {orderDetails.payment.razorpay_payment_id}<br />
                                        Color: {orderDetails.product_variation.color.color}<br />
                                        Size: {orderDetails.product_variation.size.size}<br />
                                        Total Amount: ₹{orderDetails.total_amount}<br />
                                        Quantity: {orderDetails.quantity}<br />
                                        Order Date: {new Date(orderDetails.order_date).toLocaleDateString()}<br />
                                        Order Status: {orderDetails.order_status}
                                    </p>
                                </div>

                                {/* Progress Bar */}
                                <div className="progress-bar flex items-center justify-between my-4">
                                    {orderStatuses.map((status, index) => (
                                        <div key={status} className="flex-1 flex items-center">
                                            <div
                                                className={`w-8 h-8 rounded-full text-center font-bold ${getStatusIndex(orderDetails.order_status) >= index
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-300'
                                                    }`}
                                            >
                                                {index + 1}
                                            </div>
                                            {index < orderStatuses.length - 1 && (
                                                <div className="flex-1 h-2 bg-gray-300 mx-2">
                                                    {getStatusIndex(orderDetails.order_status) > index && (
                                                        <div className="h-full bg-green-500"></div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
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
