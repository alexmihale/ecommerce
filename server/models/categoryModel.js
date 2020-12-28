const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  parent: { type: String, default: null },
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
