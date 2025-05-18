const mongoose = require('mongoose');

// Define the Product Schema
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: String,
  description: String,
  price: Number,
  quantity: Number,
  photo: String,
});

// Create the Product Model based on the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
