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
      totalPrice: totalPrice - 1000,
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
          cancel_action: `${process.env.CART_URL}`, // Your homepage URL
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
      console.log(order);
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

// export const getMyOrders = async (req, res) => {};

export const getAllOrders = async (req, res) => {
  try {
    // Parse pagination parameters from the query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20; // Default limit of 20
    const skip = (page - 1) * limit;

    // Get the total count of all orders in the database
    const totalOrders = await Order.countDocuments({});

    const newOrders = await Order.find({ seen: false }).sort({ createdAt: -1 });

    // Fetch the orders with pagination
    const orders = await Order.find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'products.productId',
        model: 'Product',
        select: 'name price images category', // Select specific product fields to populate
      });

    // Check if there are more pages available
    const hasMore = page * limit < totalOrders;

    return res.status(200).json({
      success: true,
      orders,
      newOrders,
      currentPage: page,
      totalOrders,
      hasMore,
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error. Could not retrieve orders.',
    });
  }
};

export const markOrderSeen = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the order by ID and update the 'seen' field to true.
    // The { new: true } option returns the updated document.
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { seen: true },
      { new: true, runValidators: true }
    ).populate({
      path: 'products.productId',
      model: 'Product',
      select: 'name price images category',
    });

    // If no order is found with the provided ID, return a 404 error
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // Return the updated order with a success message
    return res.status(200).json({
      success: true,
      message: 'Order marked as seen.',
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Error marking order as seen:', error);

    // Handle Mongoose CastError for an invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format.',
      });
    }

    // Handle other server errors
    return res.status(500).json({
      success: false,
      message: 'Server Error. Could not update order status.',
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Attempt to find and delete the order by its ID
    const deletedOrder = await Order.findByIdAndDelete(id);

    // If no order is found with the provided ID, return a 404 error
    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // Return a success message and the deleted order's data
    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully.',
      data: deletedOrder,
    });
  } catch (error) {
    console.error('Error deleting order:', error);

    // Handle Mongoose CastError for an invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format.',
      });
    }

    // Handle other server errors
    return res.status(500).json({
      success: false,
      message: 'Server Error. Could not delete order.',
    });
  }
};

export const getSalesSummary = async (req, res) => {
  try {
    const summary = await Order.aggregate([
      // Stage 1: Filter for only 'paid' orders
      { $match: { orderStatus: 'paid' } },

      // Stage 2: Deconstruct the 'products' array
      { $unwind: '$products' },

      // Stage 3: Filter out any bad data that doesn't have a quantity
      { $match: { 'products.quantity': { $exists: true, $type: 'number' } } },

      // 🟢 FIXED: Stage 4 - Group by original order ID to get individual order totals
      {
        $group: {
          _id: '$_id',
          // Get the original totalPrice from the first document in the group
          totalPrice: { $first: '$totalPrice' },
          totalProducts: { $sum: '$products.quantity' },
        },
      },

      // 🟢 FIXED: Stage 5 - Create a grand total from the results of the previous group
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalPrice' }, // Correctly sum the non-duplicated totalPrices
          totalPaidOrders: { $sum: 1 }, // Count the number of orders
          totalProducts: { $sum: '$totalProducts' },
        },
      },

      // Stage 6 (Optional): Remove the _id field and project the final values
      {
        $project: {
          _id: 0,
          totalSales: 1,
          totalPaidOrders: 1,
          totalProducts: 1,
        },
      },
    ]);

    if (summary.length === 0) {
      return res.status(200).json({
        success: true,
        data: { totalSales: 0, totalPaidOrders: 0, totalProducts: 0 },
      });
    }

    return res.status(200).json({
      success: true,
      data: summary[0],
    });
  } catch (error) {
    console.error('Error getting sales summary:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error. Could not get sales summary.',
    });
  }
};
