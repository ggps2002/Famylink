import express from "express";
import NannyShare from "../Schema/nannyShare.js";
import { authMiddleware } from "../Services/utils/middlewareAuth.js";
import User from "../Schema/user.js";

const router = express.Router();

// POST a new Nanny Share job
router.post("/", authMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optional: Only allow certain user types to post jobs (e.g., 'Parent', 'Admin')
    if (!["Parents", "Admin"].includes(user.type)) {
      return res
        .status(403)
        .json({ message: "Access denied. Unauthorized user." });
    }

    const data = req.body;

    const requiredFields = [
      "noOfChildren",
      "specificDays",
      "schedule",
      "style",
      "responsibility",
      "hourlyRate",
      "pets",
      "communicate",
      "backupCare",
      "involve",
      "activity",
      "guideline",
      "healthConsideration",
      "scheduleAndArrangement",
      "jobDescription",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return res
          .status(400)
          .json({ message: `Missing required field: ${field}` });
      }
    }

    const nannySharePost = new NannyShare({ ...data, user: userId });

    await nannySharePost.save();

    res.status(201).json({
      message: "Nanny Share job posted successfully",
      job: nannySharePost,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// DELETE a Nanny Share job by ID (only if it belongs to the current user)
router.delete("/:id", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const jobId = req.params.id;

  try {
    const job = await NannyShare.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Nanny Share job not found" });
    }

    // Check if the job belongs to the logged-in user
    if (job.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this job" });
    }

    await NannyShare.findByIdAndDelete(jobId);

    res.status(200).json({ message: "Nanny Share job deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const jobId = req.params.id;
  const updateData = req.body;

  try {
    const job = await NannyShare.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Nanny Share job not found" });
    }

    // Check ownership
    if (job.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this job" });
    }

    // Update only the provided fields
    Object.keys(updateData).forEach((key) => {
      job[key] = updateData[key];
    });

    await job.save();

    const updatedJob = await NannyShare.findById(jobId).populate({
      path: "user",
      select: "email name imageUrl",
    });
    res.status(200).json({
      message: "Nanny Share job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const {
      minChildren = 1,
      maxChildren = 2,
      minAge = 0,
      maxAge = 18,
      minRate = 0,
      maxRate = 100,
      page = 1,
      limit = 10,
      location,
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const currentUser = await User.findById(req.userId).select("location type");

    if (currentUser?.type === "Nanny") {
      return res.status(400).json({ message: "You aren't authorized" });
    }

    if (!currentUser?.location?.coordinates) {
      return res.status(400).json({ message: "User location not found" });
    }

    const [lng, lat] = currentUser.location.coordinates;
    const radiusInMiles = location ? parseFloat(location) : 5;
    const radiusInKm = radiusInMiles * 1.60934;
    const radiusInRadians = radiusInKm / 6378.1;

    // Step 1: Get nearby users
    const nearbyUsers = await User.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radiusInRadians],
        },
      },
    }).select("_id");

    const nearbyUserIds = nearbyUsers.map((u) => u._id);

    // Step 2: Get all matching shares (unpaginated) for full filtering
    const allMatchingShares = await NannyShare.find({
      user: { $in: nearbyUserIds },
      "noOfChildren.length": {
        $gte: Number(minChildren),
        $lte: Number(maxChildren),
      },
      $or: [
        {
          "hourlyRate.min": {
            $exists: true,
            $gte: Number(minRate),
            $lte: Number(maxRate),
          },
        },
        {
          hourlyRate: {
            $type: "number",
            $gte: Number(minRate),
            $lte: Number(maxRate),
          },
        },
      ],
    })
      .populate("user", "name email imageUrl zipCode location")
      .sort({ createdAt: -1 });

    // Step 3: Final filtering by children's age
    const fullyFiltered = allMatchingShares.filter((share) => {
      const childrenInfo = share?.noOfChildren?.info;

      if (!childrenInfo || typeof childrenInfo !== "object") return false;

      const childAges = Object.values(childrenInfo)
        .map((age) => Number(age))
        .filter((age) => !isNaN(age));

      if (!childAges.length) return false;

      const childrenCount = share.noOfChildren.length || childAges.length;

      return (
        childrenCount >= Number(minChildren) &&
        childrenCount <= Number(maxChildren) &&
        childAges.some((age) => age >= Number(minAge) && age <= Number(maxAge))
      );
    });

    const totalRecords = fullyFiltered.length;
    const totalPages = Math.ceil(totalRecords / limitNumber);
    const paginatedData = fullyFiltered.slice(skip, skip + limitNumber);

    return res.status(200).json({
      status: 200,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: pageNumber,
        pageSize: limitNumber,
      },
      data: paginatedData,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const nannyShare = await NannyShare.findById(id).populate({
      path: "user",
      select: "email name imageUrl", // only include these fields
    });

    if (!nannyShare) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({ data: nannyShare });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

router.get("/nanny-share-opportunities/:zipCode", async (req, res) => {
  const { zipCode } = req.params;

  try {
    // Step 1: Find users in the zip code
    const users = await User.find({ zipCode }).select("_id name location");
    const userMap = {};

    const formatLocation = (zip, format_location) => {
      if (!zip || !format_location)
        return "";
      const parts = format_location.split(",") || [];
      const city = parts.at(-3)?.trim();
      const state = parts.at(-2)?.trim().split(" ")[0];
      return city && state ? `${city}, ${state}` : "";
    };

    users.forEach((u) => {
      userMap[u._id.toString()] = {
        name: u.name,
        location: formatLocation(zipCode, u.location?.format_location) || "Unknown Neighborhood",
      };
    });

    const userIds = Object.keys(userMap);

    // Step 2: Fetch nanny share posts by those users
    const posts = await NannyShare.find({ user: { $in: userIds } });

    const formatted = posts.map((post) => {
      const userInfo = userMap[post.user.toString()];
      const childrenCount = post.noOfChildren?.length || 0;
      const ages = Object.values(post.noOfChildren?.info || {}).join(", ");
      const kids = `${childrenCount} kid${childrenCount > 1 ? "s" : ""} (ages ${ages})`;

      const scheduleRange = (() => {
        const day = Object.keys(post.specificDays || {}).find(
          (d) => post.specificDays[d]?.checked
        );
        if (!day) return "Schedule not specified";
        const entry = post.specificDays[day];
        const start = new Date(entry.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const end = new Date(entry.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        return `${day}, ${start}–${end}`;
      })();

      const min = post.hourlyRate?.minShare;
      const max = post.hourlyRate?.maxShare;
      const rate =
        min && max && min !== max
          ? `$${min}–$${max}/hour per family`
          : `$${min || max}/hour per family`;

      return {
        families: `${userInfo.name.split(" ")[0]} Family`,
        location: userInfo.location,
        rate: rate || "Rate not specified",
        savings: "Compatible Families",
        schedule: scheduleRange,
        kids,
        description: post.jobDescription.slice(0, 120) + "...",
        cta: "Contact Families – Sign Up Required",
      };
    });

    return res.json({ success: true, data: formatted });
  } catch (err) {
    console.error("Error fetching nanny share opportunities:", err);
    return res.status(500).json({ success: false, message: "Server Error", err });
  }
});


export default router;
