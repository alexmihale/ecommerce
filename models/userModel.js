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
      type: String,
      default: 'user',
    },
    avatar: { type: String, default: null },
    deliveryAddress: [
      {
        firstName: { type: String, default: null },
        lastName: { type: String, default: null },
        phoneNumber: { type: String, default: null },
        district: { type: String, default: null },
        city: { type: String, default: null },
        address: { type: String, default: null },
      },
    ],
    invoiceAddress: [
      {
        firstName: { type: String, default: null },
        lastName: { type: String, default: null },
        phoneNumber: { type: String, default: null },
        district: { type: String, default: null },
        city: { type: String, default: null },
        address: { type: String, default: null },
      },
    ],
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    favourite: [
      //TODO: create favourite products functionality and add it to user model
      { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    ],
    review: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }], //TODO: create review products functionality and add it to user model
    order: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], //TODO: create orders functionality and add it to user model
    voucher: [
      //TODO: create vouchers functionality and add it to user model
      { type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' },
    ],
    warranty: [
      //TODO: create warranty functionality and add it to user model
      { type: mongoose.Schema.Types.ObjectId, ref: 'Warranty' },
    ],
    productsCreated: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
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
