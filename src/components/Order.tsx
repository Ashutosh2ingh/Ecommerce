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
    order_status_date: string;
}

const orderStatuses = ["Processing", "Shipped", "Out For Delivery", "Delivered"];

const OrderDetails: React.FC<OrderDetailsProps> = ({ isOpen, onClose, orderId }) => {

    const [orderDetails, setOrderDetails] = useState<OrderItem | null>(null);
    const [shipmentAddress, setShipmentAddress] = useState({
        name: '',
        email: '',
        phone: '',
        flat_building_no: '',
        city: '',
        state: '',
        country: '',
        pincode: ''
    });
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

    // Fetch specific order details by order ID
    useEffect(() => {

        const fetchShipmentDetail = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/shipment-address/", {
                    method: "GET",
                    headers: {
                        "Authorization": `Token ${token}`,
                    },
                });
                const data = await response.json();
                setShipmentAddress(data);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchShipmentDetail();
    }, [token]);

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

                            {/* Close Button */}
                            <div className="relative">
                                <motion.p
                                    variants={fadeIn('up', 0.4)}
                                    initial="hidden"
                                    whileInView={'show'}
                                    viewport={{ once: false, amount: 0.3 }}
                                    className="absolute top-0 right-2 w-7 h-7 bg-ashu hover:text-white hover:bg-accent rounded-full"
                                >
                                    <button onClick={onClose} type='button' className="text-lg font-bold ps-2">
                                        &times;
                                    </button>
                                </motion.p>
                            </div>

                            <div>
                                <h4 className="h2 font-semibold mb-2 text-accent text-center"
                                >
                                    Order Details
                                </h4>

                                {/* Grid for Order Details Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                                    {/* Product Information Card */}
                                    <motion.div className="p-4 bg-white rounded-lg shadow-md" variants={fadeIn('up', 0.6)}>
                                        <h3 className="h5 font-semibold text-ashu">{orderDetails.product_variation.product_name}</h3>
                                        <p> <b>Color:</b> {orderDetails.product_variation.color.color}</p>
                                        <p> <b>Size:</b> {orderDetails.product_variation.size.size}</p>
                                    </motion.div>

                                    {/* Order Summary Card */}
                                    <motion.div className="p-4 bg-white rounded-lg shadow-md" variants={fadeIn('up', 0.8)}>
                                        <h3 className="h5 font-semibold text-ashu">Order Summary</h3>
                                        <p> <b>Total Amount:</b> ₹{orderDetails.total_amount}</p>
                                        <p> <b>Quantity:</b> {orderDetails.quantity}</p>
                                    </motion.div>

                                    {/* Payment Information Card */}
                                    <motion.div className="p-4 bg-white rounded-lg shadow-md" variants={fadeIn('up', 0.4)}>
                                        <h3 className="h5 font-semibold text-ashu">Payment Information</h3>
                                        <p> <b>Payment Status:</b> {orderDetails.payment.payment_status}</p>
                                        <p> <b>Payment ID:</b> {orderDetails.payment.razorpay_payment_id}</p>
                                    </motion.div>

                                    {/* Order Status Card */}
                                    <motion.div className="p-4 bg-white rounded-lg shadow-md" variants={fadeIn('up', 1.0)}>
                                        <h3 className="h5 font-semibold text-ashu">Order Status</h3>
                                        <p>
                                            <b>Status Updated: </b>
                                            {new Date(orderDetails.order_status_date).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true // Set to true for 12-hour format
                                            }).replace(',', '')}
                                            {/* {new Date(orderDetails.order_status_date).toLocaleDateString()} */}
                                        </p>
                                        <p> <b>Status:</b> {orderDetails.order_status}</p>
                                    </motion.div>
                                </div>

                                {/* Shipment Address Card */}
                                <motion.div className="p-4 bg-white rounded-lg shadow-md" variants={fadeIn('up', 1.2)}>
                                    <h3 className="h5 font-semibold text-ashu">Delivery Address</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p><b>Name:</b> {shipmentAddress.name}</p>
                                            <p><b>Email:</b> {shipmentAddress.email}</p>
                                            <p><b>Phone:</b> {shipmentAddress.phone}</p>
                                            <p><b>City:</b> {shipmentAddress.city} - {shipmentAddress.pincode}</p>
                                        </div>
                                        <div>
                                            <p><b>Address:</b> {shipmentAddress.flat_building_no}</p>
                                            <p><b>State:</b> {shipmentAddress.state}</p>
                                            <p><b>Country:</b> {shipmentAddress.country}</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Progress Bar */}
                                <motion.div className="ms-12 progress-bar flex items-center justify-between mt-6" variants={fadeIn('up', 1.2)}>
                                    {orderDetails.order_status === "Cancelled" ? (
                                        // Render only "Processing" and "Cancelled" when status is "Cancelled"
                                        ["Processing", "Cancelled"].map((status, index) => (
                                            <div key={status} className="flex-1 flex flex-col items-center">
                                                <div className="flex items-center w-full">
                                                    <div
                                                        className={`w-5 h-5 rounded-full text-center font-bold flex-shrink-0 ${'bg-red-500 text-white'
                                                            }`}
                                                    >
                                                    </div>
                                                    {index < 1 && (
                                                        <div className="flex-grow h-1 bg-gray-300 mx-2">
                                                            {orderDetails.order_status == 'Cancelled' && (
                                                                <div className="h-full bg-red-500"></div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-md -ms-52 lg:-ms-72 mt-2">{status}</p>
                                            </div>
                                        ))
                                    ) : (
                                        // Render full status set when order status is not "Cancelled"
                                        orderStatuses.map((status, index) => (
                                            <div key={status} className="flex-1 flex flex-col items-center">
                                                <div className="flex items-center w-full">
                                                    <div
                                                        className={`w-5 h-5 rounded-full text-center font-bold flex-shrink-0 ${getStatusIndex(orderDetails.order_status) >= index
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-gray-300'
                                                            }`}
                                                    >
                                                    </div>
                                                    {index < orderStatuses.length - 1 && (
                                                        <div className="flex-grow h-1 bg-gray-300 mx-2">
                                                            {getStatusIndex(orderDetails.order_status) > index && (
                                                                <div className="h-full bg-green-500"></div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-md -ms-32 mt-2">{status}</p>
                                            </div>
                                        ))
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OrderDetails;
