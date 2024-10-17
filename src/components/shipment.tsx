import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import CustomButton from "@/components/CustomButton";
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '@/lib/variants';
import { toast, ToastContainer } from 'react-toastify';

interface ShipmentProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    productPrice: string;
    productQuantity: number;
    productVariationId: number;
    onOrderCreated: (productId: number) => void;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

const Shipment: React.FC<ShipmentProps> = ({ isOpen, onClose, productName, productPrice, productQuantity, productVariationId, onOrderCreated }) => {

    const [shipmentAddress, setShipmentAddress] = useState({
        name: "",
        email: "",
        phone: "",
        flat_building_no: "",
        city: "",
        pincode: "",
        state: "",
        country: "",
    });
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Dynamically load the Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Clean up the script if the component unmounts
            document.body.removeChild(script);
        };
    }, []);

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

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShipmentAddress({
            ...shipmentAddress,
            [name]: value
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8000/shipment-address/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`,
                },
                body: JSON.stringify(shipmentAddress),
            });
            const data = await response.json();
            if (response.status === 200 || response.status === 201) {
                toast.success(data.message);
                setTimeout(() => {
                    onClose();
                    initiateRazorpayPayment();
                }, 3000);
            } else {
                toast.error("Error updating Shipment Details");
            }
        } catch (error) {
            console.error("Error updating Shipment Detail:", error);
        }
    };

    const initiateRazorpayPayment = () => {
        const product_price = parseFloat(productPrice);
        const product_quantity = productQuantity;
        const totalAmount = product_price * product_quantity * 100;

        const options = {
            key: "rzp_test_y5XK5rBqc7230w",
            amount: totalAmount,
            currency: "INR",
            name: "AshuStore",
            description: "Test Transaction",
            handler: async (
                response: {
                    razorpay_payment_id: string
                }) => {
                await handlePaymentSuccess(response, "success");
            },
            prefill: {
                name: "ashuStore",
                email: "user@example.com",
                contact: "8707332099",
            },
            notes: {
                address: "Razorpay Corporate Office",
            },
            theme: {
                color: "#3399cc",
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', async (response: any) => {
            console.error("Payment failed:", response.error);
            await handlePaymentSuccess(response, "failed");
            toast.error("Payment failed. Please try again.");
        });
        rzp.open();
    };

    const handlePaymentSuccess = async (response: { razorpay_payment_id: string }, status: string) => {
        try {
            const paymentResponse = await fetch("http://127.0.0.1:8000/payment/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`,
                },
                body: JSON.stringify({
                    amount: parseFloat(productPrice) * productQuantity,
                    razorpay_payment_id: response.razorpay_payment_id,
                    payment_status: status
                }),
            });

            const paymentData = await paymentResponse.json();

            if (paymentResponse.status === 200 || paymentResponse.status === 201) {

                const orderId = await createOrder(response.razorpay_payment_id);

                if (orderId) {
                    onOrderCreated(productVariationId);
                } else {
                    toast.error("Failed to create order.");
                }

            } else {
                toast.error(paymentData.message || "Payment processed but failed to record the details.");
            }
        } catch (error) {
            console.error("Error in saving payment:", error);
            toast.error("Error in saving payment details");
        }
    };

    const createOrder = async (paymentId: string) => {
        try {

            const response = await fetch("http://127.0.0.1:8000/create-order/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`,
                },
                body: JSON.stringify({
                    payment_id: paymentId,
                    product_variation_id: productVariationId,
                    quantity: productQuantity,
                }),
            });

            const orderData = await response.json();

            if (response.ok) {
                return orderData.data.order_id;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in creating order:", error);
            return null;
        }
    };

    return (
        <AnimatePresence>
            <ToastContainer />
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
                                    Shipment Details
                                </h4>
                                <h3 className='h5 font-semibold mb-4 text-ashu text-center'>{productName}</h3>
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                                    <div>
                                        <label className="block h5 font-medium">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={shipmentAddress.name}
                                            onChange={handleChange}
                                            className="input-box border rounded-lg p-2 w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block h5 font-medium">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={shipmentAddress.email}
                                            onChange={handleChange}
                                            className="input-box border rounded-lg p-2 w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block h5 font-medium">Contact</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={shipmentAddress.phone}
                                            onChange={handleChange}
                                            className="input-box border rounded-lg p-2 w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block h5 font-medium">Address</label>
                                        <input
                                            type="text"
                                            name="flat_building_no"
                                            value={shipmentAddress.flat_building_no}
                                            onChange={handleChange}
                                            className="input-box border rounded-lg p-2 w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block h5 font-medium">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={shipmentAddress.city}
                                            onChange={handleChange}
                                            className="input-box border rounded-lg p-2 w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block h5 font-medium">Pincode</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={shipmentAddress.pincode}
                                            onChange={handleChange}
                                            className="input-box border rounded-lg p-2 w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block h5 font-medium">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={shipmentAddress.state}
                                            onChange={handleChange}
                                            className="input-box border rounded-lg p-2 w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block h5 font-medium">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={shipmentAddress.country}
                                            onChange={handleChange}
                                            className="input-box border rounded-lg p-2 w-full"
                                        />
                                    </div>
                                    <div className="mt-3 md:col-span-2 flex justify-center">
                                        <CustomButton
                                            text='Submit'
                                            containerStyles='md:w-[186px] md:h-[55px] w-[120px] h-[40px] rounded-lg'
                                        />
                                    </div>
                                </form>
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

export default Shipment;
