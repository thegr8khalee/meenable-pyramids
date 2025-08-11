import { CircleCheck, CircleX, Loader2 } from 'lucide-react';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCheckOutStore } from '../store/useCheckoutStore';
import { useEffect } from 'react';
import { formatTime } from '../lib/utils';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();

  const message = searchParams.get('message');

  console.log(message);

  return (
    <div className="font-[inter]">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 items-center justify-center">
        <div className="max-w-5xl mx-auto bg-base-200 p-6 rounded-none shadow-xl items-center justify-center flex flex-col">
          <CircleX className="size-20 stroke-red-500 mb-4" />
          <h1 className="font-medium text-2xl">Payment Failed!</h1>
          <h1 className="font-medium text-2xl">{message}</h1>
          <p className="text-xs text-gray-500 mt-1">Please try again.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
