const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  url: String,
  price: String,
  originalPrice: String,
  maxTemperature: String,
  material: String,
  emfEmission: String,
  status: String,
  views: Number,
});

module.exports = mongoose.model("Product", productSchema);
