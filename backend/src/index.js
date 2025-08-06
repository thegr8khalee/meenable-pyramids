import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import adminRoutes from './routes/admin.route.js';
import contatcRoutes from './routes/contact.route.js';
import productRoutes from './routes/product.routes.js'
import path from 'path';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact/', contatcRoutes);
app.use('/api/products', productRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log('Server running on port: ', PORT);
  connectDB();
});
