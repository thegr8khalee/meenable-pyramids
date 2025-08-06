// models/User.js
import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  // Changed productId to item to support both Product and Collection in cart
  item: { type: mongoose.Schema.Types.ObjectId, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
});

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    phoneNumber: { type: String, required: false }, // Added phone number, not required
    cart: [cartItemSchema], // Embedded cart
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;