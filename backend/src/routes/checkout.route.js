import express from 'express';
import bodyParser from 'body-parser';
import {
  callback,
  checkOut,
  deleteOrder,
  getAllOrders,
  getOrderbyId,
  getSalesSummary,
  markOrderSeen,
  webhook,
} from '../controller/checkout.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';
import { protectAdminRoute } from '../middleware/protectAdminRoute.js';

const router = express.Router();

router.post('/', checkOut);
router.get('/callback', callback);
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), webhook);
router.get('/get/all', protectAdminRoute, getAllOrders);
router.get('/get/:id', getOrderbyId);
router.put('/mark/:id', protectAdminRoute, markOrderSeen);
router.delete('/del/:id', protectAdminRoute, deleteOrder);
router.get('/sales-summary', protectAdminRoute, getSalesSummary);
export default router;
