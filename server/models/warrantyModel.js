const mongoose = require('mongoose');

const warrantySchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    expirationDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const Warranty = mongoose.model('Warranty', warrantySchema);
module.exports = Warranty;
