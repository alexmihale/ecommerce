const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },

    discountType: { type: String, required: true },
    discount: { type: Number, required: true },
    isPrivate: { type: Boolean, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const Voucher = mongoose.model('Voucher', voucherSchema);
module.exports = Voucher;
