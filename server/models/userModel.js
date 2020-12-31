const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    salutation: { type: String, default: null },
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
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
      default: false,
    },
    avatar: { type: String, default: null },
    deliveryAddress: [
      {
        name: { type: String, default: null },
        phoneNumber: { type: String, default: null },
        district: { type: String, default: null },
        city: { type: String, default: null },
        address: { type: String, default: null },
      },
    ],
    invoiceAddress: [
      {
        name: { type: String, default: null },
        phoneNumber: { type: String, default: null },
        district: { type: String, default: null },
        city: { type: String, default: null },
        address: { type: String, default: null },
      },
    ],
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }],
    favourite: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    ],
    review: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    order: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    voucher: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' },
    ],
    warranty: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Warranty' },
    ],
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

userSchema.methods.getPublicProfile = async function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
