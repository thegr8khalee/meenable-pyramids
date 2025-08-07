import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
// import { identifyGuest } from '../middleware/identifyGuest.js';
import Product from '../models/product.model.js'; // Adjust path
import {
  addToCart,
  checkItemExistence,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItemQuantity,
} from '../controller/cart.controller.js';
// import Collection from '../models/collection.model.js'; // Adjust path

const router = express.Router();

router.get('/', protectRoute, getCart);
router.put('/add', protectRoute, addToCart);
router.put('/remove', protectRoute, removeFromCart);
router.delete('/clear', protectRoute, clearCart);
router.put('/updatequantity', protectRoute, updateCartItemQuantity);
router.post('/check-existence', checkItemExistence);

router.post('/details-by-ids', async (req, res) => {
  try {
    const { productIds = [] } = req.body;

    // Fetch products
    const products = await Product.find({ _id: { $in: productIds } });

    // Fetch collections
    // const collections = await Collection.find({ _id: { $in: collectionIds } });

    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching item details by IDs:', error);
    res.status(500).json({ message: 'Failed to fetch item details.' });
  }
});

export default router;
