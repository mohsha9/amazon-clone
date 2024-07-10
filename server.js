require('dotenv').config()

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
// const { type } = require("os");
const PORT = 5000;

app.use(express.json());
// Enable CORS for specific origin
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/Products", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Failed to connect to MongoDB", error));

const productSchema = new mongoose.Schema({
  id: String,
  image: String,
  name: String,
  rating: Object,
  priceCents: Number,
  keywords: Array,
  type: String,
  sizeChartLink: String,
});

const orderSchema = new mongoose.Schema({
  deliveryOptionId: String,
  productId: String,
  quantity: Number,
});

const orderProductSchema = new mongoose.Schema({
  id: String,
  orderTime: {type: Date, default: Date.now},
  products: {type: [orderSchema], require: true},
  totalCostPrice: Number,
});

const Product = mongoose.model("Product", productSchema);
const OrderProduct = mongoose.model("Order", orderProductSchema);

app.post("/orders", async (req, res) => {
  console.log("Received order request:", req.body);
  const { cartItems, totalCostPrice } = req.body;
  try {
    const newOrder = new OrderProduct({
      products: cartItems,
      totalCostPrice: totalCostPrice,
    });

    const savedOrder = await newOrder.save();
    console.log("Order saved successfully:", savedOrder);
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ error: err.message });
  }
});


app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(400).send({ error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
