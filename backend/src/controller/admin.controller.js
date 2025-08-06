// controllers/adminAuthController.js

import Admin from '../models/admin.model.js'; // Import the Admin model
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js'; // Re-use the same token generation utility
import Product from '../models/product.model.js'; // Ensure correct path
// import Collection from '../models/collection.model.js'; // To validate collectionId
import mongoose from 'mongoose';
import cloudinary from '../lib/cloudinary.js';

export const adminSignup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Input validation
    if (!username || !email || !password) {
      return res.status(400).json({
        message:
          'All fields (username, email, password) are required for admin signup.',
      });
    }

    // Check if admin with given email or username already exists
    const adminExists = await Admin.findOne({ $or: [{ email }, { username }] });
    if (adminExists) {
      return res
        .status(400)
        .json({ message: 'Admin with this email or username already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new admin instance
    const newAdmin = new Admin({
      username,
      email,
      passwordHash,
    });

    // Save the new admin to the database
    await newAdmin.save();

    // Generate JWT token for admin (you might want a different token secret or payload for admins)
    // For simplicity, we'll use the same generateToken, but in a real app, distinguish admin tokens.
    generateToken(newAdmin._id, res, 'admin'); // Pass 'admin' as role/type for token differentiation

    // Respond with success message and admin data (excluding passwordHash)
    res.status(201).json({
      _id: newAdmin._id,
      username: newAdmin.username,
      email: newAdmin.email,
      createdAt: newAdmin.createdAt,
      updatedAt: newAdmin.updatedAt,
      message: 'Admin registered successfully.',
    });
  } catch (error) {
    console.error('Error in adminSignup controller: ', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  console.log(email);

  try {
    // Input validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required for admin login.' });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Compare provided password with hashed password in the database
    const isPasswordCorrect = await bcrypt.compare(
      password,
      admin.passwordHash
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Generate JWT token for admin
    generateToken(admin._id, res, 'admin'); // Pass 'admin' role/type

    // Respond with admin data (excluding passwordHash)
    res.status(200).json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      role: 'admin',
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      message: 'Admin logged in successfully.',
    });
  } catch (error) {
    console.error('Error in adminLogin controller: ', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const adminLogout = (req, res) => {
  try {
    // Clear the JWT cookie by setting its maxAge to 0
    // Ensure this matches the cookie name used for admin tokens
    res.cookie('jwt', '', {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json({ message: 'Admin logged out successfully.' });
  } catch (error) {
    console.error('Error in adminLogout controller: ', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const addProduct = async (req, res) => {
  const {
    name,
    description,
    category,
    ingredients,
    images, // This will be an array of Base64 strings from the frontend
    isBestSeller,
    isPromo, // This will be a number or undefined from frontend
  } = req.body;

  let price = parseFloat(req.body.price);
  let discountedPrice =
    req.body.discountedPrice !== ''
      ? parseFloat(req.body.discountedPrice)
      : undefined;

  // Basic validation using the parsed numeric values

  // Basic validation
  if (!name || !description || !price || !category) {
    return res.status(400).json({
      message:
        'Please enter all required product fields: name, description, price, category.',
    });
  }
  // Frontend should already ensure discountedPrice is a number or undefined when isPromo is true
  // Backend validation for discountedPrice when isPromo is true
  if (
    isPromo &&
    (discountedPrice === undefined ||
      discountedPrice === null ||
      isNaN(discountedPrice))
  ) {
    return res.status(400).json({
      message:
        'Discounted price is required and must be a valid number if product is on promotion.',
    });
  }
  if (discountedPrice !== undefined && discountedPrice >= price) {
    return res.status(400).json({
      message: 'Discounted price must be less than the original price.',
    });
  }
  if (price < 0 || (discountedPrice !== undefined && discountedPrice < 0)) {
    return res
      .status(400)
      .json({ message: 'Price and discounted price must be non-negative.' });
  }

  try {
    const uploadedImages = [];
    if (images && images.length > 0) {
      for (const imageData of images) {
        if (
          typeof imageData !== 'string' ||
          !imageData.startsWith('data:image')
        ) {
          console.warn('Skipping invalid image data:', imageData);
          continue;
        }
        const uploadResponse = await cloudinary.uploader.upload(imageData, {
          folder: 'furniture_products',
        });
        uploadedImages.push({
          url: uploadResponse.secure_url,
          public_id: uploadResponse.public_id,
        });
      }
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      ingredients,
      images: uploadedImages,
      isBestSeller: isBestSeller || false,
      isPromo: isPromo || false,
      // FIX: Ensure discountedPrice is a valid number when isPromo is true, otherwise undefined
      discountedPrice:
        isPromo &&
        typeof discountedPrice === 'number' &&
        !isNaN(discountedPrice)
          ? discountedPrice
          : undefined,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error in addProduct controller: ', error.message);
    // Check for Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json({ message: 'Product validation failed', errors });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const {
    name,
    description,
    category,
    ingredients,
    images,
    isBestSeller,
    isPromo,
  } = req.body;

  // Parse price and discountedPrice from string to number for update
  let price =
    req.body.price !== undefined ? parseFloat(req.body.price) : undefined;
  let discountedPrice =
    req.body.discountedPrice !== undefined && req.body.discountedPrice !== ''
      ? parseFloat(req.body.discountedPrice)
      : undefined;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid Product ID format.' });
  }

  // Validation for update fields
  if (price !== undefined && (isNaN(price) || price < 0)) {
    return res
      .status(400)
      .json({ message: 'Price must be a non-negative number.' });
  }
  if (isPromo !== undefined && isPromo) {
    if (
      isNaN(discountedPrice) ||
      discountedPrice === null ||
      discountedPrice === undefined
    ) {
      return res.status(400).json({
        message:
          'Discounted price is required and must be a valid number if product is set to promotion.',
      });
    }
  }
  if (
    discountedPrice !== undefined &&
    price !== undefined &&
    discountedPrice >= price
  ) {
    return res.status(400).json({
      message: 'Discounted price must be less than the original price.',
    });
  }
  if (
    discountedPrice !== undefined &&
    (isNaN(discountedPrice) || discountedPrice < 0)
  ) {
    return res
      .status(400)
      .json({ message: 'Discounted price must be non-negative.' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const newImageUploads = [];
    const imagesToKeep = [];

    if (images && images.length > 0) {
      for (const imageData of images) {
        if (
          typeof imageData === 'object' &&
          imageData.url &&
          imageData.public_id === true
        ) {
          imagesToKeep.push(imageData);
        } else if (
          typeof imageData === 'object' &&
          imageData.url &&
          imageData.isNew
        ) {
          const base64String = imageData.url;
          if (
            typeof base64String === 'string' &&
            base64String.startsWith('data:image')
          ) {
            const uploadResponse = await cloudinary.uploader.upload(
              base64String,
              {
                folder: 'furniture_products',
              }
            );
            newImageUploads.push({
              url: uploadResponse.secure_url,
              public_id: uploadResponse.public_id,
            });
          } else {
            console.warn(
              'Skipping invalid new image data (not a Base64 string):',
              imageData
            );
          }
        } else {
          console.warn('Skipping unrecognized image data format:', imageData);
        }
      }
    }
    const finalImages = [...imagesToKeep, ...newImageUploads];

    const publicIdsToDelete = product.images
      .map((img) => img.public_id) // Ensure this is correct property name from DB
      .filter(
        (publicId) =>
          publicId && !finalImages.some((img) => img.public_id === publicId)
      ); // Ensure img.public_id here matches DB property
    // console.log(
    //   '6. Public IDs to delete from Cloudinary (publicIdsToDelete):',
    //   JSON.stringify(publicIdsToDelete)
    // );

    for (const publicId of publicIdsToDelete) {
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted image from Cloudinary: ${publicId}`);
      } catch (deleteError) {
        console.error(
          `Error deleting image ${publicId} from Cloudinary:`,
          deleteError
        );
      }
    }
    // --- End Image Handling ---

    // Update fields dynamically
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined && !isNaN(price)) product.price = price;
    if (category !== undefined) product.category = category;
    if (ingredients !== undefined) product.ingredients = ingredients;
    product.images = finalImages; // Assign the processed images
    if (isBestSeller !== undefined) product.isBestSeller = isBestSeller;
    if (isPromo !== undefined) product.isPromo = isPromo;

    // Handle discountedPrice logic based on isPromo
    if (product.isPromo) {
      if (discountedPrice !== undefined && !isNaN(discountedPrice)) {
        product.discountedPrice = discountedPrice;
      } else {
        return res.status(400).json({
          message:
            'Discounted price is required and must be a valid number when product is on promotion.',
        });
      }
    } else {
      product.discountedPrice = undefined;
    }
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error in updateProduct controller: ', error.message);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json({ message: 'Product validation failed', errors });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const delProduct = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid Product ID format.' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Delete associated images from Cloudinary using their public_ids
    for (const image of product.images) {
      if (image.public_id) {
        // Only delete if public_id exists
        await cloudinary.uploader.destroy(image.public_id);
        console.log(`Deleted image from Cloudinary: ${image.public_id}`);
      }
    }

    await Product.deleteOne({ _id: productId }); // Use deleteOne for clarity

    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error in delProduct controller: ', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
