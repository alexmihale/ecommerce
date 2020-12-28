const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 256, trim: true },
    description: { type: String, required: true },
    image: [{ type: String, required: true }],
    productCode: { type: String, required: true },
    review: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    rating: { type: Number, default: 0 },
    price: { type: Number, required: true },
    isOnSale: { type: Boolean, default: false },
    newPrice: { type: Number, default: null },
    discount: { type: Number, default: null },
    isInStock: { type: String, required: true },
    stock: { type: Number, required: true },
    //  Specs will be saved as an object
    // to be able to create dynamic specification table
    specs: { type: Object, required: true },
    //  FIXME: the variant type should be as a string or as below?
    //  variants are same products but different specs ( like memmory size, color etc.)
    //  variant should store id of product
    variant: [{ type: mongoose.Schema.Types.ObjectId, default: null }],
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
