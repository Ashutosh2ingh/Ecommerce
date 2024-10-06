import React from 'react';
import CustomButton from "@/components/CustomButton";
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '@/lib/variants';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { toast, ToastContainer } from 'react-toastify';

interface ShipmentProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
}

const Shipment: React.FC<ShipmentProps> = ({ isOpen, onClose, productName }) => { 
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
                }, 3000);
            } else {
                toast.error("Error updating Shipment Details");
            }
        } catch (error) {
            console.error("Error updating Shipment Detail:", error);
        }
    };

    return(
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
                                <h4 className="h2 font-semibold mb-8 text-accent text-center"
                                >
                                    Shipment Details
                                </h4>
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-6"  onSubmit={handleSubmit}>
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
                                            name="zip"
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
