// routes/adminAuthRoutes.js

import express from 'express';
import {
  addProduct,
  addRecipe,
  adminLogin,
  adminLogout,
  adminSignup,
  delProduct,
  delRecipe,
  editRecipe,
  getAllUsers,
  getRecipeById,
  toggleRodd,
  updateProduct,
} from '../controller/admin.controller.js';
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

router.get('/operations/getUsers', protectAdminRoute, getAllUsers);

router.post('/operations/recipe/new', protectAdminRoute, addRecipe);
router.post('/operations/recipe/edit', protectAdminRoute, editRecipe);
router.delete('/operations/recipe/remove', protectAdminRoute, delRecipe);
router.put('/operations/recipe/rodd/:recipeId', protectAdminRoute, toggleRodd);
export default router;
