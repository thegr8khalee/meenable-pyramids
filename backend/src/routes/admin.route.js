// routes/adminAuthRoutes.js

import express from 'express';
import { addProduct, adminLogin, adminLogout, adminSignup, delProduct, updateProduct } from '../controller/admin.controller.js';
import { protectAdminRoute } from '../middleware/protectAdminRoute.js';
const router = express.Router();

router.post('/signup', adminSignup);
router.post('/login', adminLogin);
router.post('/logout', adminLogout);

router.post('/operations/addProduct', protectAdminRoute, addProduct);
router.put(
  '/operations/updateProduct/:productId',
  protectAdminRoute,
  updateProduct
);
router.delete(
  '/operations/delProduct/:productId',
  protectAdminRoute,
  delProduct
);

export default router;
