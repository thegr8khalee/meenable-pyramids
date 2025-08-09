// controllers/adminAuthController.js

import Admin from '../models/admin.model.js'; // Import the Admin model
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js'; // Re-use the same token generation utility
import Product from '../models/product.model.js'; // Ensure correct path
import User from '../models/user.model.js';
import mongoose from 'mongoose';
import cloudinary from '../lib/cloudinary.js';
import Recipe from '../models/recipe.model.js';

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
    // Step 1: Delete all recipes that contain the product
    // The query uses `ingredients` as per your provided Recipe schema.
    const deletedRecipes = await Recipe.deleteMany({ ingredients: productId });
    console.log(
      `Deleted ${deletedRecipes.deletedCount} recipes containing product: ${productId}`
    );

    // Step 2: Find and delete the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Step 3: Delete associated images from Cloudinary using their public_ids
    for (const image of product.images) {
      if (image.public_id) {
        // Only delete if public_id exists
        await cloudinary.uploader.destroy(image.public_id);
        console.log(`Deleted image from Cloudinary: ${image.public_id}`);
      }
    }

    // Step 4: Delete the product itself from the database
    await Product.deleteOne({ _id: productId }); // Use deleteOne for clarity

    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error in delProduct controller: ', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50; // Set default limit to 50
    const skip = (page - 1) * limit;

    // Get the total count of all users
    const totalUsers = await User.countDocuments({});

    // Fetch users with pagination, selecting all fields except the password
    const users = await User.find({})
      .select('-password')
      .skip(skip)
      .limit(limit);

    // Determine if there are more pages/items available
    const hasMore = page * limit < totalUsers;

    return res.status(200).json({
      success: true,
      users,
      currentPage: page,
      totalUsers,
      hasMore,
    });
  } catch (error) {
    console.error('Error fetching all users:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error. Could not retrieve users.',
    });
  }
};

export const addRecipe = async (req, res) => {
  const { name, description, ingredients, image, rodd } = req.body;

  // Basic validation
  if (
    !name ||
    !description ||
    !ingredients ||
    ingredients.length === 0 ||
    !image
  ) {
    return res.status(400).json({
      message:
        'Please provide all required recipe fields: name, description, image, and ingredients.',
    });
  }

  try {
    // Upload the single image to Cloudinary
    let uploadedImage = {};
    if (image && typeof image === 'string' && image.startsWith('data:image')) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'recipe_images',
      });
      uploadedImage = {
        url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id,
      };
    } else {
      return res.status(400).json({ message: 'Invalid image data provided.' });
    }

    // Create and save the new recipe
    const newRecipe = new Recipe({
      name,
      description,
      ingredients,
      image: uploadedImage,
      isRecipeOfTheDay: rodd,
    });

    const savedRecipe = await newRecipe.save();

    // Populate ingredients to return a more complete object
    const populatedRecipe = await Recipe.findById(savedRecipe._id).populate(
      'ingredients',
      'name price isPromo discountedPrice' // Populate fields needed for a more useful response
    );

    res.status(201).json(populatedRecipe);
  } catch (error) {
    console.error('Error in addRecipe controller:', error.message);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json({ message: 'Recipe validation failed', errors });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const editRecipe = async (req, res) => {
  const { _id, name, description, ingredients, image, rodd } = req.body;

  if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
    return res
      .status(400)
      .json({ message: 'A valid recipe ID is required for editing.' });
  }

  try {
    const existingRecipe = await Recipe.findById(_id);
    if (!existingRecipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    let updatedImage = existingRecipe.image;
    // If a new image is provided, delete the old one and upload the new one
    if (image && typeof image === 'string' && image.startsWith('data:image')) {
      if (existingRecipe.image?.public_id) {
        await cloudinary.uploader.destroy(existingRecipe.image.public_id);
      }
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'recipe_images',
      });
      updatedImage = {
        url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id,
      };
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      _id,
      {
        name,
        isRecipeOfTheDay: rodd,
        description,
        ingredients,
        image: updatedImage,
      },
      { new: true, runValidators: true }
    ).populate('ingredients', 'name price isPromo discountedPrice');

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error('Error in editRecipe controller:', error.message);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json({ message: 'Recipe validation failed', errors });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const delRecipe = async (req, res) => {
  const { _id } = req.body;

  if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
    return res
      .status(400)
      .json({ message: 'A valid recipe ID is required for deletion.' });
  }

  try {
    const recipe = await Recipe.findById(_id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    // Delete the image from Cloudinary
    if (recipe.image && recipe.image.public_id) {
      await cloudinary.uploader.destroy(recipe.image.public_id);
    }

    await Recipe.findByIdAndDelete(_id);
    res
      .status(200)
      .json({ message: 'Recipe and its image deleted successfully.' });
  } catch (error) {
    console.error('Error in delRecipe controller:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getRecipeById = async (req, res) => {
  const { recipeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).json({ message: 'Invalid recipe ID format.' });
  }

  try {
    const recipe = await Recipe.findById(recipeId).populate(
      'ingredients',
      'name'
    );
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }
    res.status(200).json(recipe);
  } catch (error) {
    console.error('Error in getRecipeById controller:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const toggleRodd = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { isRecipeOfTheDay } = req.body;

    // Find the recipe and update its status
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    recipe.isRecipeOfTheDay = isRecipeOfTheDay;
    await recipe.save(); // The pre-save hook will run here

    // Send the updated recipe back to the client
    res.status(200).json({ message: 'Recipe updated successfully.', recipe });
  } catch (error) {
    console.error('Error toggling Recipe of the Day:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
