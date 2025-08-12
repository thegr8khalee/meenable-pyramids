import { CircleCheck, Loader2 } from 'lucide-react';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCheckOutStore } from '../store/useCheckoutStore';
import { useEffect } from 'react';
import { formatTime } from '../lib/utils';
import { useCartStore } from '../store/UseCartStore';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();

  const { order, fetchOrderById, isGettingOrder } = useCheckOutStore();
  const { clearCart, isRemovingFromCart } = useCartStore();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    fetchOrderById(orderId);
    clearCart();
  }, [fetchOrderById, orderId, clearCart]);

  console.log(order);

  if (isGettingOrder || isRemovingFromCart) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-2 text-lg">Loading order details...</p>
      </div>
    );
  }

  if (!order && !isGettingOrder) {
    return (
      <div className="text-center text-xl text-gray-600 mt-16">
        Order not found
      </div>
    );
  }

  return (
    <div className="font-[inter]">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 items-center justify-center">
        <div className="max-w-5xl mx-auto bg-base-200 p-6 rounded-none shadow-xl items-center text-center justify-center flex flex-col">
          <CircleCheck className="size-20 stroke-green-500 mb-4" />
          <h1 className="font-medium text-2xl">Thank You!</h1>
          <h1 className="font-medium text-2xl">
            Your order has been recieved.
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            You will recieve an email with your order details soon.
          </p>

          <div className="w-full space-y-1 mt-12 max-w-3xl bg-base-100 rounded-none border-1 border-gray-300 p-4 text-start">
            <h1 className="font-medium text-xl">Order details</h1>
            <div className="flex justify-between items-end w-full">
              <h1 className="text-sm">Order Id:</h1>
              <h1 className="text-sm">{orderId}</h1>
            </div>
            <div className="flex justify-between items-end w-full">
              <h1 className="text-sm">Date:</h1>
              <h1 className="text-sm">{formatTime(order.createdAt)}</h1>
            </div>
            <div className="h-0.5 bg-gray-200 my-2"></div>
            <div className="flex justify-between items-end w-full">
              <h1 className="text-sm">Subtotal:</h1>
              <h1 className="text-sm">₦{order.totalPrice}</h1>
            </div>
            <div className="flex justify-between items-end w-full">
              <h1 className="text-sm">Delivery:</h1>
              <h1 className="text-sm">₦1000</h1>
            </div>
            <div className="flex justify-between items-end w-full">
              <h1 className="font-bold text-sm">Total:</h1>
              <h1 className="text-sm font-bold">₦{order.totalPrice}</h1>
            </div>
          </div>
          <div className=" max-w-3xl text-start w-full my-8">
            <h1 className="font-semibold text-2xl">Products</h1>
            <div>
              {order.products && order.products.length > 0 ? (
                order.products.map((item, index) => (
                  <div
                    key={index}
                    className="border-b-1 border-gray-300 py-4 flex flex-col justify-center"
                  >
                    <div className="flex justify-between w-full">
                      <h1 className="font-medium">{item.name}</h1>
                      <h1>₦{item.price}</h1>
                    </div>

                    <h1 className="text-sm">Quantity: {item.quantity}</h1>
                  </div>
                ))
              ) : (
                <li>No products</li>
              )}
            </div>
          </div>

          <div className=" max-w-3xl text-start w-full">
            <h1 className="font-semibold text-2xl">Customer Details</h1>
            <div className="flex w-full justify-between">
              <h1>Name:</h1>
              <h1>{order.username}</h1>
            </div>
            <div className="flex w-full justify-between">
              <h1>Phone Number:</h1>
              <h1>{order.phoneNumber}</h1>
            </div>
            <div className="flex w-full justify-between">
              <h1>Email:</h1>
              <h1>{order.email}</h1>
            </div>
            <div className="flex w-full justify-between">
              <h1>Delivery Address:</h1>
              <h1>{order.deliveryAddress}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
