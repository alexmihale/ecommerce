const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    product: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderId: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, default: 'Order sent' },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
