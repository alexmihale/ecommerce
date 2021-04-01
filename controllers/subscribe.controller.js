const Subscription = require('../models/subscriptionModel');
const HttpError = require('../utils/HttpError');

const subscribe = async (req, res) => {
  const { email } = req.body;

  const subscription = await Subscription.findOne({ email });

  if (subscription) {
    res.status(400).send({ msg: 'User already subscribed' });
    throw new HttpError('User already subscribed', 400);
  }

  const subscribe = new Subscription({
    email,
  });

  try {
    await subscribe.save();
    res.status(200).send({ msg: 'User subscribed successfully' });
  } catch (e) {
    res.status(500).send(e);
  }
};

const unsubscribe = async (req, res) => {
  const { email } = req.body;

  const subscription = await Subscription.findOne({ email });

  if (!subscription) {
    res.status(400).send({ msg: 'User already unsubscribed' });
    throw new HttpError('User already unsubscribed', 400);
  }

  try {
    subscription.remove();
    res.status(200).send({ msg: 'User unsubscribed successfully' });
  } catch (e) {
    res.status(500).send(e);
  }
};
module.exports = {
  subscribe,
  unsubscribe,
};
