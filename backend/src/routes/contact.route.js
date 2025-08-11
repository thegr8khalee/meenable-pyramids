import express from 'express';
import { sendContactEmail, sendOrderEmail } from '../controller/email.controller.js';
// import { sendContactEmail } from '../controllers/email.controller.js';

const router = express.Router();

router.post('/', sendContactEmail);
router.post('/order', sendOrderEmail);

export default router;
