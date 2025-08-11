// seed.js

// 🔴 IMPORTANT: Add this line to the top to load environment variables from .env
import 'dotenv/config';

import mongoose from 'mongoose';
import Product from './models/product.model.js'; // Adjust path as needed
import Recipe from './models/recipe.model.js'; // Adjust path as needed
import { connectDB } from './lib/db.js';

// A simple function to generate a random number within a range
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// A simple function to generate a random word
const getRandomWord = () => {
  const words = [
    'Delicious',
    'Spicy',
    'Hearty',
    'Savory',
    'Sweet',
    'Tangy',
    'Zesty',
    'Rich',
    'Creamy',
    'Fluffy',
    'Crispy',
    'Roasted',
    'Grilled',
    'Baked',
    'Fresh',
    'Simple',
    'Quick',
    'Easy',
    'Healthy',
  ];
  return words[Math.floor(Math.random() * words.length)];
};

// A function to generate a random product name
const generateProductName = (index) => {
  const categories = ['Spice', 'Herb', 'Seasoning', 'Chilli Powder'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const name = `${getRandomWord()} ${category} ${index}`;
  return name;
};

// A function to generate a random recipe name
const generateRecipeName = (index) => {
  const names = [
    'Chicken Stir-Fry',
    'Beef Tacos',
    'Vegetable Curry',
    'Spicy Spaghetti',
    'Lentil Soup',
  ];
  const name = `${getRandomWord()} ${
    names[Math.floor(Math.random() * names.length)]
  } ${index}`;
  return name;
};

const seedDB = async () => {
  try {
    // We connect to the DB using the connectDB function.
    await connectDB();
    console.log('MongoDB connected successfully!');

    // --- Clean up old data ---
    console.log('Clearing existing products and recipes...');
    await Product.deleteMany({});
    await Recipe.deleteMany({});
    console.log('Old data cleared.');

    // --- Create 50 Products ---
    console.log('Creating 50 products...');
    const createdProducts = [];
    for (let i = 1; i <= 50; i++) {
      const isPromo = Math.random() > 0.7; // 30% chance of being a promo item
      const price = getRandomNumber(10, 100);

      const product = {
        name: generateProductName(i),
        description: `A unique blend of ${getRandomWord().toLowerCase()} ingredients. This product is perfect for any dish.`,
        ingredients: `Product ingredients ${i}`,
        price: price,
        category: ['spice', 'herb', 'seasoning', 'chilli powder'][
          getRandomNumber(0, 3)
        ],
        images: [
          {
            url: `https://placehold.co/400x300/E0E0E0/333333?text=Product+${i}`,
          },
        ],
        stock: getRandomNumber(10, 200),
        isBestSeller: Math.random() > 0.8, // 20% chance
        isPromo: isPromo,
        discountedPrice: isPromo
          ? Math.max(price - getRandomNumber(5, 20), 1)
          : undefined,
      };
      const newProduct = new Product(product);
      await newProduct.save();
      createdProducts.push(newProduct);
    }
    console.log('50 products created successfully!');

    // --- Create 50 Recipes ---
    console.log('Creating 50 recipes...');
    for (let i = 1; i <= 50; i++) {
      const recipeIngredients = [];
      const numIngredients = getRandomNumber(5, 10); // Each recipe has 5-10 ingredients

      // Get a shuffled list of product IDs to pick from
      const shuffledProductIds = createdProducts
        .sort(() => 0.5 - Math.random())
        .map((p) => p._id);

      for (let j = 0; j < numIngredients; j++) {
        recipeIngredients.push(shuffledProductIds[j]);
      }

      const recipe = {
        name: generateRecipeName(i),
        description: `An exquisite recipe to delight your taste buds. This dish is made with the finest ingredients.`,
        image: {
          url: `https://placehold.co/800x600/E0E0E0/333333?text=Recipe+${i}`,
          public_id: `recipe-${i}`,
        },
        ingredients: recipeIngredients,
        isRecipeOfTheDay: i === 1, // Only the first recipe is the recipe of the day
      };

      const newRecipe = new Recipe(recipe);
      await newRecipe.save();
    }
    console.log('50 recipes created successfully!');

    console.log('Database seeding complete!');
  } catch (error) {
    console.error('An error occurred during seeding:', error);
  } finally {
    if (mongoose.connection) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
    }
  }
};

seedDB();
