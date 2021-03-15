const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    product: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    ], // TODO: ADD PRODUCT TO CART
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
