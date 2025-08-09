// src/controllers/reviewControllers.js

import Product from '../models/product.model.js';
import mongoose from 'mongoose';

export const addReview = async (req, res) => {
  const { productId } = req.params;
  const { reviewRating, reviewComment } = req.body;
  // userId is retrieved from the authenticated user's session/token
  const userId = req.user.id;

  // Basic validation
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid product ID.' });
  }
  if (!reviewRating) {
    return res.status(400).json({ message: 'reviewRating is required.' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Check if the user has already reviewed this product
    const alreadyReviewed = product.reviews.find(
      (review) => review.userId.toString() === userId
    );
    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: 'Product already reviewed by this user.' });
    }

    const newReview = {
      userId,
      name: req.user.username,
      rating: reviewRating,
      comment: reviewComment,
    };
    product.reviews.push(newReview);
    await product.save();

    res.status(201).json({
      message: 'Review added successfully.',
      name: newReview.name,
      review: newReview,
      averagereviewRating: product.rating,
    });
  } catch (error) {
    console.error('Error in addReview controller:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const editReview = async (req, res) => {
  const { productId, reviewId } = req.params;
  const { reviewRating, reviewComment } = req.body;
  const userId = req.user.id;

  if (
    !mongoose.Types.ObjectId.isValid(productId) ||
    !mongoose.Types.ObjectId.isValid(reviewId)
  ) {
    return res.status(400).json({ message: 'Invalid product or review ID.' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const reviewToEdit = product.reviews.id(reviewId);
    if (!reviewToEdit) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    // Security check: Ensure the user is the review owner
    if (reviewToEdit.userId.toString() !== userId) {
      return res
        .status(401)
        .json({ message: 'Not authorized to edit this review.' });
    }

    // Update the review
    reviewToEdit.rating =
      reviewRating !== undefined ? reviewRating : reviewToEdit.rating;
    reviewToEdit.comment =
      reviewComment !== undefined ? reviewComment : reviewToEdit.comment;

    await product.save();

    res.status(200).json({
      message: 'Review updated successfully.',
      review: reviewToEdit,
      averageRating: product.averageRating,
    });
  } catch (error) {
    console.error('Error in editReview controller:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteReview = async (req, res) => {
  const { productId, reviewId } = req.params;
  const userId = req.user.id;

  if (
    !mongoose.Types.ObjectId.isValid(productId) ||
    !mongoose.Types.ObjectId.isValid(reviewId)
  ) {
    return res.status(400).json({ message: 'Invalid product or review ID.' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const reviewToDelete = product.reviews.id(reviewId);
    if (!reviewToDelete) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    // Crucial security check: Ensure the user is the owner of the review
    if (reviewToDelete.userId.toString() !== userId) {
      return res
        .status(401)
        .json({ message: 'Not authorized to delete this review.' });
    }

    // Remove the review from the array
    product.reviews.pull({ _id: reviewId });
    await product.save();

    res.status(200).json({
      message: 'Review deleted successfully.',
      averageRating: product.averageRating,
    });
  } catch (error) {
    console.error('Error in deleteReview controller:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getReviews = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID.' });
  }

  try {
    // Find the product and populate the user details for each review
    const product = await Product.findById(id)
      .select('reviews averageRating')
      .populate({
        path: 'reviews.userId',
        select: 'name', // Only retrieve the user's name
      });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json({
      reviews: product.reviews,
      averageRating: product.averageRating,
    });
  } catch (error) {
    console.error('Error in getReviews controller:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
