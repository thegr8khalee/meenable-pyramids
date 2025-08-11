// backend/controllers/contactController.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

/**
 * @desc    Send a contact form email
 * @route   POST /api/contact
 * @access  Public
 * @param   {Object} req - Express request object (expects { name, email, subject, message } in body)
 * @param   {Object} res - Express response object
 */
export const sendContactEmail = async (req, res) => {
  const { name, email, phoneNumber, subject, message } = req.body;

  // 1. Basic input validation
  if (!name || !email || !phoneNumber || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // 2. Configure Nodemailer transporter
  // Use your email service provider's SMTP settings.
  // Example for Gmail (less secure app access must be enabled or use App Passwords):
  // For production, consider a dedicated email service like SendGrid, Mailgun, AWS SES.
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Or 'outlook', 'yahoo', or specific host/port for other SMTP
    auth: {
      user: process.env.EMAIL_USER, // Your email address from .env
      pass: process.env.EMAIL_PASS, // Your email password or app password from .env
    },
  });

  // 3. Define email options
  const mailOptions = {
    from: `"${name}" <${email}>`, // Sender's name and email
    to: process.env.RECEIVING_EMAIL, // The email address where you want to receive messages
    subject: `Contact Form: ${subject}`,
    html: `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone Number:</strong> ${phoneNumber}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `,
  };

  // 4. Send the email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending contact email:', error);
    res
      .status(500)
      .json({ message: 'Failed to send message. Please try again later.' });
  }
};

export const sendOrderEmail = async (req, res) => {
  const order = req.body;

  // 1. Basic input validation
  if (!order || !order.email || !order.products) {
    return res.status(400).json({ message: 'Order data is incomplete.' });
  }

  // 2. Configure Nodemailer transporter
  // Use your email service provider's SMTP settings.
  // For production, consider a dedicated email service like SendGrid, Mailgun, AWS SES.
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Or 'outlook', 'yahoo', or specific host/port for other SMTP
    auth: {
      user: process.env.EMAIL_USER, // Your email address from .env
      pass: process.env.EMAIL_PASS, // Your email password or app password from .env
    },
  });

  // 3. Generate a dynamic list of ordered products
  const productsListHtml = order.products
    .map(
      (product) => `
        <li style="margin-bottom: 10px; font-size: 16px;">
          <strong>${product.name}</strong>
          (Qty: ${product.quantity}) - ₦${product.price}
        </li>
      `
    )
    .join('');

  // 4. Define email options with the new HTML template
  const mailOptions = {
    from: `Meenable Pyramids <${process.env.EMAIL_USER}>`, // Sender's name and email
    to: order.email, // The customer's email from the order object
    subject: `Order #${order._id.slice(-6)} Confirmed!`, // A more descriptive subject line
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">Thank you for your order!</h2>
        <p>Hi ${order.username},</p>
        <p>We've received your order and are preparing to ship it. Here are the details of your purchase:</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #eee;">
          <h3 style="margin-top: 0; color: #555;">Order Details</h3>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Order Status:</strong> ${order.orderStatus}</p>
          <p><strong>Subtotal:</strong> ₦${order.totalPrice}</p>
          <p><strong>Delivery:</strong> ₦1000</p>
          <p><strong>Total:</strong> ₦${order.totalPrice + 1000}</p>
        </div>

        <h3 style="color: #555;">Items Ordered:</h3>
        <ul style="list-style-type: none; padding: 0;">
          ${productsListHtml}
        </ul>

        <h3 style="color: #555;">Shipping Information</h3>
        <p><strong>Name:</strong> ${order.username}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>Phone Number:</strong> ${order.phoneNumber}</p>
        <p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>
        ${order.note ? `<p><strong>Note:</strong> ${order.note}</p>` : ''}
        
        <p style="margin-top: 20px;">If you have any questions, please contact us.</p>
        <p>Best regards,<br>Meenable Pyramids Team</p>
      </div>
    `,
  };

  // 5. Send the email
  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ message: 'Order confirmation email sent successfully!' });
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    res
      .status(500)
      .json({
        message:
          'Failed to send order confirmation email. Please try again later.',
      });
  }
};
