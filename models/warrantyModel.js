const mongoose = require('mongoose');

const warrantySchema = new mongoose.Schema( //TODO: WARRANTY FUNCTIONALITY
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    expirationDate: { type: Date, required: true },
  },
  { timestamps: true },
);

const Warranty = mongoose.model('Warranty', warrantySchema);
module.exports = Warranty;
