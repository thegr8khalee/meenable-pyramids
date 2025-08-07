// controllers/cartController.js

import User from '../models/user.model.js'; // Import User model
import Product from '../models/product.model.js'; // Import Product model to check existence
import mongoose from 'mongoose';

export const getCart = async (req, res) => {
  try {
    if (!req.user) {
      // No user, return empty cart
      return res
        .status(200)
        .json({ message: 'No active cart found.', cart: [] });
    }

    // Authenticated user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    let rawCart = user.cart; // Get the raw cart array from the user
    const productIdsInCart = [];

    // Get product IDs in cart
    rawCart.forEach((cartItem) => {
      if (cartItem.item && typeof cartItem.item.toString === 'function') {
        productIdsInCart.push(cartItem.item);
      }
    });

    // Fetch only the _id of existing products in batch query
    const existingProducts = await Product.find({ 
      _id: { $in: productIdsInCart } 
    }).select('_id');

    // Create set for efficient O(1) lookup of existing IDs
    const existingProductIdsSet = new Set(
      existingProducts.map((p) => p._id.toString())
    );

    const cleanedRawCart = [];
    const itemIdsToRemoveFromDb = []; // Store the _id of the cart entries to remove

    // Reconstruct the cart, keeping only products that still exist in the DB
    for (const cartItem of rawCart) {
      const itemIdString = cartItem.item.toString(); // Convert ObjectId to string for comparison
      const existsInDb = existingProductIdsSet.has(itemIdString);

      if (existsInDb) {
        // Product still exists in DB, keep it in the cart
        cleanedRawCart.push(cartItem);
      } else {
        // Product not found in DB (it was deleted), mark this cart entry for removal
        itemIdsToRemoveFromDb.push(cartItem._id);
      }
    }

    // If any products were identified as deleted, update the cart in the database
    if (itemIdsToRemoveFromDb.length > 0) {
      await User.findByIdAndUpdate(
        user._id,
        { $pull: { cart: { _id: { $in: itemIdsToRemoveFromDb } } } },
        { new: true }
      );
    }

    // Send the cleaned, but UNPOPULATED, cart back to the frontend
    res
      .status(200)
      .json({ message: 'Cart retrieved successfully.', cart: cleanedRawCart });
  } catch (error) {
    console.error('Error in getCart controller: ', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const addToCart = async (req, res) => {
  const { itemId, quantity = 1 } = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ message: 'Invalid Item ID format.' });
  }
  if (quantity < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1.' });
  }

  try {
    // Check if product exists
    const product = await Product.findById(itemId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not found.' });
    }

    // Authenticated user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const existingCartItemIndex = user.cart.findIndex(
      (cartItem) => cartItem.item.toString() === itemId.toString()
    );

    if (existingCartItemIndex > -1) {
      // Product already in cart, update quantity
      user.cart[existingCartItemIndex].quantity += quantity;
    } else {
      // Add new product to cart
      user.cart.push({ item: itemId, quantity });
    }

    await user.save();
    res.status(200).json({
      message: 'Product added to cart successfully.',
      cart: user.cart,
    });
  } catch (error) {
    console.error('Error in addToCart controller: ', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const removeFromCart = async (req, res) => {
  const { itemId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ message: 'Invalid Item ID format.' });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not found.' });
    }

    // Authenticated user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const initialCartLength = user.cart.length;
    user.cart = user.cart.filter(
      (cartItem) => cartItem.item.toString() !== itemId.toString()
    );

    if (user.cart.length === initialCartLength) {
      return res.status(404).json({ message: 'Product not found in cart.' });
    }

    await user.save();
    res.status(200).json({
      message: 'Product removed from cart successfully.',
      cart: user.cart,
    });
  } catch (error) {
    console.error('Error in removeFromCart controller: ', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const clearCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not found.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.cart = [];
    await user.save();

    return res.status(200).json({
      message: 'Cart cleared successfully.',
      cart: user.cart,
    });
  } catch (error) {
    console.error('Error in clearCart controller:', error.message);
    if (res.headersSent) {
      console.warn(
        'Headers already sent, cannot send error response from clearCart catch block.'
      );
      return;
    }
    res
      .status(500)
      .json({ message: 'Internal Server Error during cart clear operation.' });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  const { itemId, quantity } = req.body;

  // Input validation
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ message: 'Invalid Item ID format.' });
  }
  if (typeof quantity !== 'number' || quantity < 0) {
    return res
      .status(400)
      .json({ message: 'Quantity must be a non-negative number.' });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not found.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Find the product in the cart
    const itemIndex = user.cart.findIndex(
      (cartItem) => cartItem.item.toString() === itemId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart.' });
    }

    // Update quantity or remove product if quantity is 0
    if (quantity === 0) {
      user.cart.splice(itemIndex, 1); // Remove product
    } else {
      user.cart[itemIndex].quantity = quantity; // Update quantity
    }

    await user.save();

    res.status(200).json({
      message: 'Cart item quantity updated successfully.',
      cart: user.cart,
    });
  } catch (error) {
    console.error('Error in updateCartItemQuantity controller:', error);
    if (res.headersSent) {
      console.warn(
        'Headers already sent, cannot send error response from updateCartItemQuantity catch block.'
      );
      return;
    }
    res
      .status(500)
      .json({ message: 'Internal Server Error during cart quantity update.' });
  }
};

export const checkItemExistence = async (req, res) => {
  try {
    const { productIds = [] } = req.body;

    // Ensure IDs are valid ObjectId types
    const validProductIds = productIds.filter(
      (id) => id && typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)
    );

    const existingProducts = await Product.find({ 
      _id: { $in: validProductIds } 
    }).select('_id');

    const existingProductMap = new Set(
      existingProducts.map((p) => p._id.toString())
    );

    res.status(200).json({
      existingProductIds: Array.from(existingProductMap),
    });
  } catch (error) {
    console.error('Error checking product existence:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};