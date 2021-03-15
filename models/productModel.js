const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 256,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
      trim: true,
    },
    image: [{ type: String, required: true }],
    sku: { type: String, required: true },
    manufacturerDetails: {
      modelNumber: { type: String, required: true },
      releaseDate: { type: String, required: true },
    },
    shippingDetails: {
      weight: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      depth: { type: Number, required: true },
    },
    review: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    rating: { type: Number, default: 0 },
    price: { type: Number, required: true },
    isOnSale: { type: Boolean, default: false },
    newPrice: { type: Number, default: null },
    discount: { type: Number, default: null },
    isInStock: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    specs: { type: Object, required: true },
    variant: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'Product',
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
