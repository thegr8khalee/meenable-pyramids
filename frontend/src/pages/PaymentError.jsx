import { CircleCheck, CircleX, Loader2 } from 'lucide-react';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCheckOutStore } from '../store/useCheckoutStore';
import { useEffect } from 'react';
import { formatTime } from '../lib/utils';

const PaymentError = () => {
  const [searchParams] = useSearchParams();

  //   const { order, fetchOrderById, isGettingOrder } = useCheckOutStore();
  const message = searchParams.get('message');

  //   useEffect(() => {
  //     fetchOrderById(orderId);
  //   }, [fetchOrderById, orderId]);

  console.log(message);

  //   if (isGettingOrder) {
  //     return (
  //       <div className="flex justify-center items-center min-h-screen">
  //         <Loader2 className="h-10 w-10 animate-spin text-primary" />
  //         <p className="ml-2 text-lg">Loading order details...</p>
  //       </div>
  //     );
  //   }

  //   if (!order && !isGettingOrder) {
  //     return (
  //       <div className="text-center text-xl text-gray-600 mt-16">
  //         Order not found
  //       </div>
  //     );
  //   }

  return (
    <div className="font-[inter]">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 items-center justify-center">
        <div className="max-w-5xl mx-auto bg-base-200 p-6 rounded-none shadow-xl items-center justify-center flex flex-col">
          <CircleX className="size-20 stroke-red-500 mb-4" />
          <h1 className="font-medium text-2xl">Payment Error!</h1>
          <h1 className="font-medium text-2xl">
            {message}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Please try again.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentError;
