const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    product: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: { type: Number },
      },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
