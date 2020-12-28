const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    //  Discount Type could be percentage or value
    discountType: { type: String, required: true },
    discount: { type: Number, required: true },
    //  If a voucher is private then it will be assigned to a user
    //  else if a voucher is public user will be null
    isPrivate: { type: Boolean, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
