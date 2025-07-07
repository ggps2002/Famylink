import express from "express";
import Subscription from "../Schema/subscription.js";
import { authMiddleware } from "../Services/utils/middlewareAuth.js";
import User from "../Schema/user.js";

const router = express.Router();

router.post("/news-letter", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if already subscribed
    const user = await Subscription.findOne({ email });

    if (user) {
      return res.status(409).json({
        message: "Already Subscribed",
      });
    }

    // Create new subscription
    const newSubscription = new Subscription({ email });
    await newSubscription.save();

    res.status(200).json({
      message: "Successfully subscribed to the newsletter!",
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is an admin
    if (user.type !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Only Admins can get this data' });
    }

    const { limit, page, email } = req.query;

    const pageSize = parseInt(limit) || 10;
    const currentPage = parseInt(page) || 1;
    const skip = (currentPage - 1) * pageSize;

    // Optional filter by email
    const filter = {};
    if (email) {
      filter.email = { $regex: email, $options: "i" }; // Case-insensitive search
    }

    const subscribers = await Subscription.find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const totalCount = await Subscription.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / pageSize);

    res.status(200).json({
      status: 200,
      data: subscribers,
      pagination: {
        totalRecords: totalCount,
        totalPages,
        currentPage,
        limit: pageSize,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: err.message,
    });
  }
});

export default router;
