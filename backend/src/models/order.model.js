// models/order.model.js

import mongoose from 'mongoose';

// Define a sub-schema for products within an order.
const orderProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  // 🔴 UPDATED: The category field is now here, specific to each product
  category: {
    type: String,
    enum: ['spice', 'herb', 'seasoning', 'chilli powder'],
    required: true,
  },
});

// Main Order Schema
const orderSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
    },
    deliveryAddress: {
      type: String,
      required: [true, 'Delivery address is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    // The total price of the order
    totalPrice: {
      type: Number,
      required: [true, 'Order total price is required'],
      min: 0,
    },
    // The list of products in the order
    products: [orderProductSchema],
    // The order status with enum
    orderStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Create the Order model
const Order = mongoose.model('Order', orderSchema);

export default Order;
