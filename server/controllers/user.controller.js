const User = require('../models/userModel');

const getUsers = async (req, res) => {
  const users = await User.find({});
  res.send(users);
};

const postUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const newUser = new User({ firstName, lastName, email, password });
  await newUser.save();

  const showUser = await newUser.getPublicProfile();

  res.send(showUser);
};

module.exports = {
  getUsers,
  postUser,
};
