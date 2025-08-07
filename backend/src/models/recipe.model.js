// src/models/Recipe.js
import mongoose from 'mongoose';

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
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to ensure only one recipe is marked as "Recipe of the Day"
RecipeSchema.pre('save', async function (next) {
  // Check if this recipe is being set as the new "Recipe of the Day"
  if (this.isModified('isRecipeOfTheDay') && this.isRecipeOfTheDay) {
    try {
      // Find the old "Recipe of the Day" and set its flag to false
      await this.constructor.updateMany(
        { _id: { $ne: this._id }, isRecipeOfTheDay: true },
        { isRecipeOfTheDay: false }
      );
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

export default Recipe;
