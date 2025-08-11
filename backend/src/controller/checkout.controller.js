import mongoose from 'mongoose';
import Order from '../models/order.model.js';
import axios from 'axios';
import Product from '../models/product.model.js';
import crypto from 'crypto';

export const checkOut = async (req, res) => {
  try {
    // 1. Extract necessary data from the request body, including the new cart structure
    const { username, email, phoneNumber, deliveryAddress, note, cart } =
      req.body;

    // 2. Validate incoming data
    if (
      !username ||
      !email ||
      !phoneNumber ||
      !deliveryAddress ||
      !cart ||
      cart.length === 0
    ) {
      return res
        .status(400)
        .json({ error: 'Missing required order information or empty cart.' });
    }

    // 🔴 3. Fetch full product details from the database using the cart's product IDs
    const productIds = cart.map((item) => item.item);
    const productsFromDb = await Product.find({ _id: { $in: productIds } });

    // Create a mapping for easy lookup
    const productsMap = productsFromDb.reduce((acc, product) => {
      acc[product._id.toString()] = product;
      return acc;
    }, {});

    let totalPrice = 1000;
    const orderProducts = [];

    // 🔴 4. Build the final products array for the order and calculate the total price
    for (const cartItem of cart) {
      const dbProduct = productsMap[cartItem.item];

      // If a product from the cart is not found in the DB, return an error
      if (!dbProduct) {
        return res
          .status(404)
          .json({ error: `Product with ID ${cartItem.item} not found.` });
      }

      // Determine the effective price (regular or discounted)
      const effectivePrice = dbProduct.isPromo
        ? dbProduct.discountedPrice
        : dbProduct.price;

      // Add the product details to our order-specific array
      orderProducts.push({
        productId: dbProduct._id,
        name: dbProduct.name,
        price: effectivePrice,
        quantity: cartItem.quantity,
        category: dbProduct.category, // Capture the category from the fetched product
      });

      // Calculate the total price
      totalPrice += effectivePrice * cartItem.quantity;
    }

    // 5. Create a new order with 'pending' status in the database
    const newOrder = new Order({
      username,
      email,
      phoneNumber,
      deliveryAddress,
      note,
      products: orderProducts, // Use the newly created products array
      totalPrice,
      orderStatus: 'pending',
    });

    await newOrder.save();

    const reference = newOrder._id.toString();

    // 6. Initialize Paystack transaction
    const amountInKobo = totalPrice * 100;

    const paystackRes = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amountInKobo,
        reference,
        callback_url: `${process.env.BASE_URL}/api/checkout/callback`,
        metadata: {
          cancel_action: 'http://localhost:5173/cart', // Your homepage URL
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // 7. Return the Paystack authorization URL to the client
    return res.json({ checkoutUrl: paystackRes.data.data.authorization_url });
  } catch (err) {
    console.error('Checkout failed:', err.response?.data || err.message);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
};

export const callback = async (req, res) => {
  try {
    // 1. Extract the transaction reference from the query parameters
    const { reference } = req.query;

    if (!reference) {
      return res
        .status(400)
        .json({ error: 'Transaction reference is missing.' });
    }

    // 2. Verify the transaction with Paystack
    const paystackRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const verificationData = paystackRes.data.data;

    // 3. Find the order in your database
    const order = await Order.findById(reference);

    if (!order) {
      // If the order is not found, handle this case gracefully
      return res.redirect(
        `${process.env.CLIENT_URL}/payment-error?message=Order not found`
      );
    }

    // 4. Update the order status if the verification is successful and the order is still pending
    if (
      verificationData.status === 'success' &&
      order.orderStatus === 'pending'
    ) {
      order.orderStatus = 'paid';
      await order.save();
      console.log(`Order ${order._id} successfully updated to 'paid'.`);
      // Redirect to a success page with a message
      console.log(order)
      axios
        .post(`${process.env.BASE_URL}/api/contact/order`, order)
        .catch((err) => console.error('Notification failed:', err.response));
      return res.redirect(
        `${process.env.CLIENT_URL}/payment-success?orderId=${order._id}`
      );
    } else {
      console.log(
        `Payment verification failed for order ${order._id}. Status: ${verificationData.status}`
      );
      // Redirect to a failure page with a message
      return res.redirect(
        `${process.env.CLIENT_URL}/payment-failure?message=Payment failed or was already processed`
      );
    }
  } catch (err) {
    console.error(
      'Callback verification failed:',
      err.response?.data || err.message
    );
    // On any error, redirect to a generic error page
    res.redirect(
      `${process.env.CLIENT_URL}/payment-error?message=An error occurred during verification`
    );
  }
};

export const webhook = async (req, res) => {
  try {
    // 1. Verify the Paystack signature for security
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto
      .createHmac('sha512', secret)
      .update(req.rawBody)
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      // If the signatures don't match, it's a security risk. Deny the request.
      return res.status(400).send('Signature mismatch');
    }

    // 2. Parse the request body after successful verification
    const event = req.body;

    // 3. Process the event if it's a successful charge
    if (event.event === 'charge.success') {
      const { reference, status } = event.data;

      if (status === 'success') {
        const order = await Order.findById(reference);

        // 4. Update the order status if it is still pending
        if (order && order.orderStatus === 'pending') {
          order.orderStatus = 'paid';
          await order.save();
          console.log(
            `Webhook: Order ${order._id} successfully updated to 'paid'.`
          );
        } else if (order) {
          console.log(
            `Webhook: Order ${order._id} was already processed or has an invalid status.`
          );
        } else {
          console.log(`Webhook: Order with reference ${reference} not found.`);
        }
      }
    }

    // 5. Send a 200 OK response to Paystack to acknowledge receipt of the event
    res.status(200).send('Webhook received');
  } catch (err) {
    console.error('Paystack webhook failed:', err);
    res.status(500).send('Internal Server Error');
  }
};

export const getOrderbyId = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyOrders = async (req, res) => {};

export const getAllOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  try {
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'products.productId',
        model: 'Product',
        select: 'name price images category',
      });

    res.status(200).json({
      page,
      limit,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
