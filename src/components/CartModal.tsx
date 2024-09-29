"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  product_name: string;
  discount_price: string;
  product_image: string;
  stock: number;
}

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

interface CartModalProps {
  cartItems: CartItem[];
}

const CartModal: React.FC<CartModalProps> = ({ cartItems }) => {

  const router = useRouter();

  return (
    <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20">
      {cartItems.length === 0 ? (
        <div>Cart is Empty</div>
      ) : (
        <>
          <h2 className="text-xl">Shopping Cart</h2>

          {/* Scrollable List Container */}
          <div className="flex flex-col gap-8 max-h-[calc(96px*2)] overflow-y-auto scrollbar-hide">
            {cartItems.map((item) => {
              return (
                // Item
                <div key={item.product.id} className="flex gap-4">
                  <Image
                    src={`http://127.0.0.1:8000/media/${item.product.product_image}`}
                    alt="cartImage"
                    width={72}
                    height={96}
                    className="object-cover rounded-md"
                    priority
                  />
                  <div className="flex flex-col justify-between w-full">
                    {/* Top */}
                    <div className="">
                      {/* Title */}
                      <div className="flex items-center justify-between gap-8">
                        <h3 className="font-semibold">{item.product.product_name}</h3>
                        <div className="p-1 bg-gray-50 rounded-sm">
                          ₹{item.product.discount_price}
                        </div>
                      </div>

                      {/* Description */}
                      {item.product.stock > item.quantity ? (
                        <div className="text-sm text-green-500">Available</div>
                      ) : (
                        <div className="text-sm text-red-500">Out of Stock</div>
                      )}
                    </div>

                    {/* Bottom */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Qty. {item.quantity}</span>
                      <span className="text-blue-500 cursor-pointer">Remove</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="">
            <div className="flex items-center justify-between font-semibold">
              <span>Subtotal</span>
              <span>
                ₹{cartItems
                  .reduce((acc, item) => {
                    if (item.product.stock >= item.quantity) {
                      return acc + parseFloat(item.product.discount_price) * item.quantity;
                    }
                    return acc;
                  }, 0)
                  .toFixed(2)
                }
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-2 mb-4">
              Shipping and taxes calculated at checkout
            </p>
            <div className="flex justify-between text-sm">
              <button 
                className="rounded-md py-3 px-4 ring-1 bg-black text-white ring-gray-300 hover:text-black hover:bg-white"
                onClick={() => router.push('/cartDetails')}
              >
                View Cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartModal;