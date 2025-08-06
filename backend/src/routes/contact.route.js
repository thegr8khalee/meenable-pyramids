import express from 'express';
import { sendContactEmail } from '../controller/email.controller.js';
// import { sendContactEmail } from '../controllers/email.controller.js';

const router = express.Router();

router.post('/', sendContactEmail);

export default router;
