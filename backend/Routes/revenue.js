// backend/routes/revenue.js
// routes/feedback.js
import express from 'express';
import Revenue from '../Schema/revenue.js';
import User from '../Schema/user.js';
import { authMiddleware } from "../Services/utils/middlewareAuth.js";

const router = express.Router();

router.get("/monthly", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.type !== "Admin") {
      return res.status(403).json({ message: "Access denied." });
    }
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalRevenue = await Revenue.aggregate([
      {
        $match: {
          paidAt: { $gte: firstDayOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const total = totalRevenue[0]?.total || 0;
    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch revenue", error: err.message });
  }
});

router.get("/monthly-breakdown", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.type !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1); // Jan 1st

    const revenueData = await Revenue.aggregate([
      {
        $match: {
          paidAt: { $gte: startOfYear },
        },
      },
      {
        $group: {
          _id: { $month: "$paidAt" },
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id": 1 },
      },
    ]);

    // Fill all 12 months with data and calculate growth
    const result = [];
    let prevRevenue = 0;

    for (let i = 0; i <= now.getMonth(); i++) {
      const monthNum = i + 1;
      const monthName = new Date(0, i).toLocaleString("default", { month: "short" });

      const found = revenueData.find((r) => r._id === monthNum);
      const revenue = found ? found.total : 0;

      const growth = i === 0 ? 0 : revenue - prevRevenue;

      result.push({
        name: monthName,
        revenue,
        growth,
      });

      prevRevenue = revenue;
    }

    return res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({
      message: "Failed to get revenue breakdown",
      error: err.message,
    });
  }
});

export default router
