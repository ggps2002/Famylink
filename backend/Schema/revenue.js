// models/revenue.js
import mongoose from "mongoose";

const revenueSchema = new mongoose.Schema({
  amount: Number,
  stripeCustomerId: String,
  paidAt: Date,
});

export default mongoose.model("Revenue", revenueSchema);
