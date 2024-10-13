"use client";
import { useEffect, useState } from 'react';
import Image from "next/image";
import { motion } from "framer-motion";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Shipment from '@/components/shipment';

interface Product {
  id: number;
  product_name: string;
  original_price: string;
  discount_price: string;
  product_image: string;
  short_description: string;
  stock: number;
}

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

const CartDetails = () => {

  const [cartItems, setCartItems] = useState<CartItem[]>([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CartItem | null>(null);
  const token = localStorage.getItem("token");
  
  // Fetch Cart Items
  const fetchCartItems = async () => {
    const response = await fetch("http://127.0.0.1:8000/cart/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (response.ok) {
      const data: CartItem[] = await response.json();
      setCartItems(data);
    } else {
      console.error("Failed to fetch cart items");
    }
  };

  // Call Cart
  useEffect(() => {
    fetchCartItems(); 
  }, [token]);

  // Update Cart
  const handleQuantity = async (itemId: number, action: 'i' | 'd') => {
    const currentItem = cartItems.find(item => item.id === itemId);
    
    if (!currentItem) return; 

    let newQuantity = currentItem.quantity;
    if (action === 'i') {
      newQuantity += 1;
    } else if (action === 'd') {
      newQuantity -= 1;
    }

    const response = await fetch(`http://127.0.0.1:8000/cart/update/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        product_variation_id: currentItem.product.id,
        quantity: newQuantity,
      }),
    });

    if (response.ok) {
      const responseData = await response.json();
      fetchCartItems(); // Refresh the cart items
    } else {
      const responseData = await response.json();
      toast.error(responseData.message);
    }
  };

  // Delete Cart Items
  const handleRemove = async (itemId: number) => {
    const response = await fetch(`http://127.0.0.1:8000/cart/delete/${itemId}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      toast.success(responseData.message);
      fetchCartItems(); 
    } else {
      const responseData = await response.json();
      toast.error(responseData.message);
      setTimeout(() => {
        fetchCartItems(); 
      }, 1000);
    }
  };

  const handleBuyNowClick = (item: CartItem) => {
    setSelectedProduct(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="container mx-auto">
      <ToastContainer/>
      {cartItems.map((item, index) => (
        <div key={item.id}>
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
                src={`http://127.0.0.1:8000/media/${item.product.product_image}`}
                alt={item.product.product_name}
                width={300}
                height={300}
                className="object-cover rounded-md"
              />
            </motion.div>
  
            {/* Text Section */}
            <motion.div
              className="w-full lg:w-1/2 flex flex-col gap-6"
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
              <h1 className="text-4xl font-medium">{item.product.product_name}</h1>
              <div className="h-[2px] bg-gray-100" />
  
              <div className="flex items-center gap-4">
                <h3 className="text-xl text-gray-500 line-through">₹{item.product.original_price}</h3>
                <h2 className="font-medium text-2xl">
                  ₹{item.product.discount_price}
                </h2>
              </div>
              <div className="h-[2px] bg-gray-100" />
  
              {/* Highlights */}
              <div className="text-sm">
                <h4 className="font-bold mb-4">Highlights</h4>
                <ul className="list-disc ml-5">
                  {item.product.short_description.split(/\r\n/g).map((line: string, idx: number) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              </div>

              {/* Update Quantity */}
              <div className="flex justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32">
                        <button className="cursor-pointer text-xl" onClick={() => handleQuantity(item.id, 'd')}>-</button>
                        {item.quantity}
                        <button className="cursor-pointer text-xl" onClick={() => handleQuantity(item.id, 'i')}>+</button>
                    </div>
                    {
                      item.product.stock === 0 ?(
                        <div className='text-xl'>
                          <span className='text-red-500'>Out of Stock</span>
                        </div>
                      ):(
                        item.product.stock <= 10 &&(
                          <div className='text-xs'>
                            Only <span className="text-orange-500">{item.product.stock} items </span>
                            left!<br/> {"Don't"}{""} miss it
                          </div>
                        )
                      )
                    }
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center">
                <button 
                  className="ring-1 ring-gray-400 text-ashu px-4 py-2 rounded-md hover:bg-ashu hover:text-white hover:ring-0"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </button>
                <button 
                  className="bg-ashu text-white px-4 py-2 rounded-md hover:ring-1 hover:ring-gray-400 hover:text-ashu hover:bg-white"
                  onClick={() => handleBuyNowClick(item)}
                >
                  Buy Now
                </button>
              </div>  
            </motion.div>
          </motion.div>

          {index !== cartItems.length - 1 && (
            <div className="h-[2px] bg-gray-100 my-8" />
          )}

          {index == cartItems.length-1 && (
            <div className="mb-5"/>
          )}
          
        </div>
      ))}

      {/* Shipment Modal */}
      {selectedProduct && (
        <Shipment 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          productName={selectedProduct.product.product_name}
          productPrice={selectedProduct.product.discount_price}
          productQuantity={selectedProduct.quantity}
        />
      )}
    </div>
  );
};

export default CartDetails;