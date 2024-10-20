"use client";
import { useEffect, useState } from 'react';
import Image from "next/image";
import { motion } from "framer-motion";
import OrderDetails from '@/components/Order';

interface Product {
  id: number;
  product_name: string;
  product_image: string;
}

interface Payment {
  id: number;
  payment_status: string;
  payment_date: string;
}

interface OrderItem {
  order_id: number;
  product_variation: Product;
  payement: Payment;
  quantity: number;
  total_amount: number;
  order_status: string;
  order_date: string;
  order_status_date: string;
}

const Order = () => {

  const [order, setOrder] = useState<OrderItem[]>([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const token = localStorage.getItem("token");
  
  // Fetch Order Items
  const fetchOrderItems = async () => {
    const response = await fetch("http://127.0.0.1:8000/order/", {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (response.ok) {
      const responseData = await response.json();
      if (Array.isArray(responseData.data)){
        setOrder(responseData.data);
      } 
    } else {
      console.error("Failed to fetch cart items");
    }
  };

  // Call Order
  useEffect(() => {
    fetchOrderItems(); 
  }, [token]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  const handleProductClick = (item: OrderItem) => {
    setSelectedOrder(item);
    setIsModalOpen(true);
  };


  return (
    <div className="container mx-auto">
      {order.map((item, index) => (
        <div key={item.order_id}>
          <motion.div
            className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                delay: 0.2,
                duration: 0.4,
                ease: "easeIn",
              },
            }}
          >

            {/* Image Section */}
            <motion.div
              className="w-full lg:w-1/2 lg:sticky top-20 h-max"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: {
                  delay: 0.5,
                  duration: 0.4,
                  ease: "easeIn",
                },
              }}
            >
              <Image
                src={`http://127.0.0.1:8000/media/${item.product_variation.product_image}`}
                alt={item.product_variation.product_name}
                width={100}
                height={100}
                className="object-cover rounded-md"
              />
            </motion.div>
  
            {/* Text Section */}
            <motion.div
              className="w-full lg:w-1/2 flex flex-col gap-2"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: {
                  delay: 0.8,
                  duration: 0.4,
                  ease: "easeIn",
                },
              }}
            >
              <h1 className="text-lg font-normal" style={{ textTransform: 'none' }}>
                {item.order_status === "Delivered" 
                  ? `Delivered on ${formatDate(item.order_status_date)}`
                  : item.order_status === "Cancelled"
                  ? `Cancelled on ${formatDate(item.order_status_date)}` 
                  : `Ordered on ${formatDate(item.order_date)}`}
              </h1>
              <h1 
                className="text-3xl font-medium cursor-pointer"
                onClick={() => handleProductClick(item)}
              >
                {item.product_variation.product_name}
              </h1>
              <div className="flex items-center">
                <h2 className="font-normal text-xl">
                  ₹{item.total_amount}
                </h2>
              </div>
                <p>
                  {item.order_status === "Processing" 
                    ? "Your Order is in Process"
                    : `Your Order has been ${item.order_status}`}
                </p>
            </motion.div>
          </motion.div>

          {index !== order.length - 1 && (
            <div className="h-[2px] bg-gray-100 my-8" />
          )}

          {index == order.length-1 && (
            <div className="mb-5"/>
          )}
          
        </div>
      ))}
      {/* Modal for Order Details */}
      <OrderDetails 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Order;