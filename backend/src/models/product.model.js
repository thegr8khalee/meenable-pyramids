// models/Product.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    ingredients: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ['spice', 'herb', 'seasoning', 'chilli powder'],
      default: 'spice',
      required: true,
    },
    images: [imageSchema], // Array of image objects { url }
    stock: { type: Number, required: true, min: 0, default: 0 }, // Uncomment if you track stock
    reviews: [reviewSchema], // Embedded reviews
    averageRating: { type: Number, default: 0, min: 0, max: 5 }, // Calculated average rating
    isBestSeller: { type: Boolean, default: false },
    isPromo: { type: Boolean, default: false },
    discountedPrice: {
      type: Number,
      min: 0,
      required: function () {
        return this.isPromo;
      },
    },
  },
  { timestamps: true }
);

// Pre-save hook to calculate average rating
productSchema.pre('save', function (next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    this.averageRating = (totalRating / this.reviews.length).toFixed(1);
  } else {
    this.averageRating = 0;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
