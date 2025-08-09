import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import Product from '../../../backend/src/models/product.model.js';
import toast from 'react-hot-toast';
// import { editReview } from '../../../backend/src/controller/review.controller.js';

export const useReviewStore = create((set) => ({
  isAddingReview: false,
  isDeletingReview: false,
  isEditingReview: false,

  addReview: async (ProductId, data) => {
    try {
      set({ isAddingReview: true });
      const res = await axiosInstance.post(`/review/add/${ProductId}`, data);
      if (res) {
        toast.success('Review Submitted');
      }
      
    } catch (error) {
      toast.error('Error in add review store:', error);
      console.log(error);
    } finally {
      set({ isAddingReview: false });
    }
  },

  editReview: async (productId, reviewId, data) => {
    try {
      set({ isEditingReview: true });
      const res = await axiosInstance.put(`/review/edit/${productId}/${reviewId}`, data);
      if (res) {
        toast.success('Review Updated');
      }
    } catch (error) {
      toast.error('Error in edit review store:', error);
      console.log(error);
    } finally {
      set({ isEditingReview: false });
    }
  },

  deleteReview: async (productId, reviewId) => {
    try {
      set({ isDeletingReview: true });
      const res = await axiosInstance.delete(`/review/del/${productId}/${reviewId}`);
      if (res) {
        toast.success('Review deleted');
      }
    } catch (error) {
      toast.error('Error in delete review store:', error);
      console.log(error);
    } finally {
      set({ isDeletingReview: false });
    }
  },
}));
