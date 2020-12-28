const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    salutation: { type: String, default: null },
    firstName: { type: String, trim: true, default: null },
    lastName: { type: String, trim: true, default: null },
    alias: { type: String, trim: true, default: null },
    dateOfBirth: {
      type: Date,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobilePhoneNumber: { type: String, default: null },
    homePhoneNumber: { type: String, default: null },
    isAdmin: {
      type: Boolean,
      default: null,
    },
    avatar: { type: String, default: null },
    address: {
      name: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      district: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
    },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }],
    favourite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Favourite' }],
    review: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    order: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    voucher: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' }],
    warranty: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Warranty' }],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
