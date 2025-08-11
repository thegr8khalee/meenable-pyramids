import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
// import { isGenerator } from 'framer-motion';

export const useCheckOutStore = create((set) => ({
  loading: false,
  error: null,
  checkoutUrl: null,
  order: null,
  isGettingOrder: false,

  processCheckout: async (formData) => {
    set({ loading: true, error: null, checkoutUrl: null });

    // 1. Extract data from the FormData object
    const username = formData.get('username');
    const email = formData.get('email');
    const phoneNumber = formData.get('phoneNumber');
    const deliveryAddress = formData.get('deliveryAddress');
    const note = formData.get('note');

    let cart;
    try {
      // 2. Parse the cart, which is a JSON string in the FormData, back into an object
      const cartString = formData.get('cart');
      if (!cartString) {
        throw new Error('Cart data is missing.');
      }
      cart = JSON.parse(cartString);
    } catch (parseError) {
      set({ loading: false, error: 'Invalid cart data received.' });
      toast.error('There was an error with your cart data.');
      return;
    }

    if (!cart || cart.length === 0) {
      set({ loading: false, error: 'Cannot checkout with an empty cart.' });
      toast.error('Your cart is empty.');
      return;
    }

    try {
      // 3. Create a clean JSON payload for the backend API
      const payload = {
        username,
        email,
        phoneNumber,
        deliveryAddress,
        note,
        cart,
      };

      const res = await axiosInstance.post('/checkout', payload);

      if (res.data.checkoutUrl) {
        set({ checkoutUrl: res.data.checkoutUrl });
        toast.success('Redirecting to payment...');
        // You can redirect the user here if you prefer
        window.location.href = res.data.checkoutUrl;
      } else {
        set({
          error: 'An unexpected error occurred during checkout.',
          loading: false,
        });
        toast.error('Checkout failed.');
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        'Payment initialization failed.';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },

  fetchOrderById: async (orderId) => {
    set({ isGettingOrder: true });
    try {
      const res = await axiosInstance.get(`/checkout/get/${orderId}`);
      set({
        order: res.data,
      });
    } catch (error) {
      toast.error(error);
      console.log('Error in get Order by Id:', error);
    } finally {
      set({ isGettingOrder: false });
    }
  },
}));
