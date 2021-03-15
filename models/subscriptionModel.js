const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema( //TODO: SUBSCRIPTION FUNCTIONALITY
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const Subscription = mongoose.model(
  'Subscription',
  subscriptionSchema,
);
module.exports = Subscription;
