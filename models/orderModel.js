const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    product: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    mobilePhoneNumber: {
      type: String,
      default: null,
      required: true,
    },
    deliveryAddress: {
      firstName: { type: String, default: null, required: true },
      lastName: { type: String, default: null, required: true },
      phoneNumber: { type: String, default: null, required: true },
      district: { type: String, default: null, required: true },
      city: { type: String, default: null, required: true },
      address: { type: String, default: null, required: true },
    },
    invoiceAddress: {
      firstName: { type: String, default: null, required: true },
      lastName: { type: String, default: null, required: true },
      phoneNumber: { type: String, default: null, required: true },
      district: { type: String, default: null, required: true },
      city: { type: String, default: null, required: true },
      address: { type: String, default: null, required: true },
    },
    voucher: { type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' },
    price: { type: Number, required: true },
    status: { type: String, default: 'Order sent' },
  },
  { timestamps: true },
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
