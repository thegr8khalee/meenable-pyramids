import express from 'express';
import { getProductById, getProducts, getProductsCount, getRecipes } from '../controller/product.controller.js';
import { getRecipeById } from '../controller/admin.controller.js';
// import { getProductById, getProducts, getProductsCount } from '../controllers/products.controller.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/count', getProductsCount);
router.get('/:productId', getProductById);
router.get('/recipe/get', getRecipes);
router.get('/recipe/get/:recipeId', getRecipeById);
export default router;
