import express from 'express';
import bodyParser from 'body-parser';
import {
  callback,
  checkOut,
  getAllOrders,
  getOrderbyId,
  webhook,
} from '../controller/checkout.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';
import { protectAdminRoute } from '../middleware/protectAdminRoute.js';

const router = express.Router();

router.post('/', checkOut);
router.get('/callback', callback);
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), webhook);
router.get('/get/:id', getOrderbyId);
router.get('/get/all', protectAdminRoute, getAllOrders);
export default router;
