import mongoose from 'mongoose';
import Product from './product.model.js'; // Import the Product model to access pricing details

const { Schema } = mongoose;

// Define a sub-schema for the image
const ImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
  { _id: false } // Prevents Mongoose from creating a new _id for the sub-document
);

const RecipeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Recipe name is required.'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Recipe description is required.'],
      trim: true,
    },
    // The image field is now an object with url and public_id
    image: {
      type: ImageSchema,
      required: [true, 'Recipe image is required.'],
    },
    ingredients: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product', // References the Product model
        required: [true, 'An ingredient product ID is required.'],
      },
    ],
    isRecipeOfTheDay: {
      type: Boolean,
      default: false,
    },
    // NEW: Add a price field to the schema
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate the total price and ensure only one "Recipe of the Day"
RecipeSchema.pre('save', async function (next) {
  try {
    // Check if this recipe is being set as the new "Recipe of the Day"
    if (this.isModified('isRecipeOfTheDay') && this.isRecipeOfTheDay) {
      await this.constructor.updateMany(
        { _id: { $ne: this._id }, isRecipeOfTheDay: true },
        { isRecipeOfTheDay: false }
      );
    }

    // NEW: Calculate the total price of all ingredients
    // IMPORTANT: This calculation assumes a quantity of 1 for each ingredient
    // because the schema only stores product IDs, not quantities.
    let totalCost = 0;
    if (this.ingredients && this.ingredients.length > 0) {
      const productDetails = await Product.find({
        _id: { $in: this.ingredients },
      });

      for (const product of productDetails) {
        // Use discountedPrice if a product is on promo, otherwise use the regular price
        const effectivePrice = product.isPromo
          ? product.discountedPrice
          : product.price;
        totalCost += effectivePrice; // Assumes quantity of 1
      }
    }
    this.price = totalCost;

    next();
  } catch (error) {
    console.error('Error in Recipe pre-save hook:', error);
    next(error);
  }
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

export default Recipe;
