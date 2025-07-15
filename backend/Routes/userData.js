import express from "express";
import User from "../Schema/user.js";
import { authMiddleware } from "../Services/utils/middlewareAuth.js";

const router = express.Router();

router.get("/getAllData", authMiddleware, async (req, res) => {
  const id = req.userId;

  try {
    // Fetch the current user's location
    const currentUser = await User.findById(id).select("location");
    if (
      !currentUser ||
      !currentUser.location ||
      !currentUser.location.coordinates
    ) {
      return res.status(400).send({
        status: 400,
        message: "Current user location not found or invalid.",
      });
    }

    const { coordinates } = currentUser.location; // Extract user's coordinates
    const [lng, lat] = coordinates; // [longitude, latitude]

    // Set default values for limit and page if not provided
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const page = parseInt(req.query.page) || 1; // Default page is 1
    const skip = (page - 1) * limit; // Calculate the number of records to skip

    const userType = req.query.userType || "Nanny"; // Default user type is 'Nanny'

    // Radius in radians (5000 miles = ~8046.72 kilometers; radius in radians = km / 6378.1)
    const radius = 3218.69 / 6378.1;

    // Query for users within the specified radius
    const users = await User.find({
      type: userType,
      location: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius],
        },
      },
    })
      .select("-password -online -ActiveAt -verified -entity -otp -otpExpiry") // Exclude sensitive fields
      .skip(skip) // Pagination: Skip records
      .limit(limit) // Pagination: Limit records per page
      .lean(); // Convert the result to plain JS objects

    // Count total users matching the query (ignoring skip/limit for pagination metadata)
    const totalCount = await User.countDocuments({
      type: userType,
      location: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius],
        },
      },
    });

    const totalPages = Math.ceil(totalCount / limit); // Calculate total pages

    // Respond with the paginated user list and metadata
    return res.status(200).send({
      status: 200,
      message: users,
      pagination: {
        totalRecords: totalCount, // Total number of matching records
        totalPages, // Total number of pages
        currentPage: page, // Current page number
        limit, // Records per page
      },
    });
  } catch (err) {
    // Handle errors
    return res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
});

router.get("/getFiltered", authMiddleware, async (req, res) => {
  const id = req.userId;

  try {
    const currentUser = await User.findById(id).select("location zipCode");
    if (!currentUser) {
      return res.status(404).send({
        status: 404,
        message: "Current user not found.",
      });
    }

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const {
      avaiForWorking,
      ageGroupsExp,
      interestedPosi,
      salaryRange,
      location,
      start,
    } = req.query;

    const userType = req.query.userType || "Nanny";
    const radiusInMiles = location ? parseFloat(location) : 5;
    const radiusInKm = radiusInMiles * 1.60934;
    const radius = radiusInKm / 6378.1;

    const matchStage = { type: userType };
    const additionalInfoFilters = [];

    if (salaryRange && salaryRange.length === 2) {
      const [minSalary, maxSalary] = salaryRange.map(Number);
      if (!isNaN(minSalary) && !isNaN(maxSalary)) {
        additionalInfoFilters.push({
          key: "salaryRange",
          $and: [
            { "value.min": { $gte: minSalary } },
            { "value.max": { $lte: maxSalary } },
          ],
        });
      }
    }

    if (avaiForWorking) {
      additionalInfoFilters.push({
        key: userType === "Parents" ? "preferredSchedule" : "avaiForWorking",
        "value.option": { $in: avaiForWorking.split(",").map((a) => a.trim()) },
      });
    }

    if (start) {
      additionalInfoFilters.push({
        key: "start",
        "value.option": { $in: start.split(",").map((a) => a.trim()) },
      });
    }

    if (ageGroupsExp) {
      additionalInfoFilters.push({
        key: "ageGroupsExp",
        "value.option": {
          $in: ageGroupsExp.split(",").map((exp) => exp.trim()),
        },
      });
    }

    if (interestedPosi) {
      additionalInfoFilters.push({
        key: userType === "Parents" ? "additionalServices" : "interestedPosi",
        "value.option": {
          $in: interestedPosi.split(",").map((pos) => pos.trim()),
        },
      });
    }

    if (additionalInfoFilters.length > 0) {
      matchStage.$and = additionalInfoFilters.map((filter) => ({
        additionalInfo: { $elemMatch: filter },
      }));
    }

    // Geospatial or zip fallback
    if (currentUser?.location?.coordinates?.length === 2) {
      const [lng, lat] = currentUser.location.coordinates;
      matchStage.location = {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius],
        },
      };
    } else if (currentUser?.zipCode) {
      matchStage.zipCode = currentUser.zipCode;
    } else {
      return res.status(400).send({
        status: 400,
        message: "User must have either location coordinates or a zip code.",
      });
    }

    const users = await User.aggregate([
      { $match: matchStage },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          password: 0,
          online: 0,
          ActiveAt: 0,
          verified: 0,
          entity: 0,
          otp: 0,
          otpExpiry: 0,
        },
      },
    ]);

    const totalCount = await User.countDocuments(matchStage);
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).send({
      status: 200,
      message: users,
      pagination: {
        totalRecords: totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: "Server error while fetching filtered users.",
      error: err.message,
    });
  }
});

router.get("/getUserById/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log("userId", id)

    const user = await User.findById(id)
      .select("name profilePic imageUrl type")
      .lean();

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: 200,
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Error fetching user",
      error: err.message,
    });
  }
});

router.get("/count/perType", async (req, res) => {                        // ** come back to it later
  try {
    const familyCount = await User.countDocuments({ type: "Parents" });
    const nannyCount = await User.countDocuments({ type: "Nanny" });
    return res.status(200).json({ familyCount, nannyCount });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
})

// Assuming you're using Express and have a User model imported
router.get("/getById/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters

    // Find the user by ID, excluding certain fields
    const user = await User.findById(id)
      .select(
        "-password -online -ActiveAt -verified -entity -otp -otpExpiry"
      )
      .populate({
        path: "reviews.userId", // Populate the userId in reviews
        select: "name imageUrl", // Only fetch name and imageUrl fields for the reviewer
      }) // Exclude fields
      .lean(); // Optional: convert the result to plain JS objects

    // Check if the user was found
    if (!user) {
      return res.status(404).send({
        status: 404,
        message: "User not found",
      });
    }

    const totalRating = user.reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    const averageRating =
      user.reviews.length > 0
        ? (totalRating / user.reviews.length).toFixed(1)
        : 0;
    // Send the found user
    return res.status(200).send({
      status: 200,
      message: {
        ...user,
        averageRating, // Include the average rating at the end
      },
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
});

router.get("/top-users", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.type !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Aggregation to compute avgRating and reviewCount for Nannies
    const topNannies = await User.aggregate([
      {
        $match: {
          type: "Nanny",
          "reviews.0": { $exists: true },
        },
      },
      {
        $addFields: {
          avgRating: { $avg: "$reviews.rating" },
          reviewCount: { $size: "$reviews" },
        },
      },
      { $sort: { avgRating: -1, reviewCount: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          name: 1,
          imageUrl: 1,
          avgRating: 1,
          reviewCount: 1,
        },
      },
    ]);

    const topParents = await User.aggregate([
      {
        $match: {
          type: "Parents",
          "reviews.0": { $exists: true },
        },
      },
      {
        $addFields: {
          avgRating: { $avg: "$reviews.rating" },
          reviewCount: { $size: "$reviews" },
        },
      },
      { $sort: { avgRating: -1, reviewCount: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          name: 1,
          imageUrl: 1,
          avgRating: 1,
          reviewCount: 1,
        },
      },
    ]);

    // Format function
    const formatUser = (user) => {
      const [firstName, ...rest] = user.name.split(" ");
      return {
        id: user._id,
        firstName,
        lastName: rest.join(" ") || "",
        profileImage: user.imageUrl,
        avgRating: user.avgRating || 0,
        reviewCount: user.reviewCount || 0,
      };
    };

    return res.status(200).json({
      topNannies: topNannies.map(formatUser),
      topParents: topParents.map(formatUser),
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch top users",
      error: err.message,
    });
  }
});

router.get("/families", authMiddleware, async (req, res) => {
  try {
    // Ensure only admins can access this route
    const user = await User.findById(req.userId);
    if (!user || user.type !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Pagination setup
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const query = { type: "Parents" };

    // Fetch paginated families
    const families = await User.find(query)
      .select("-password -otp -otpExpiry -notifications -__v -online")
      .skip(skip)
      .limit(limit)
      .lean();

    const totalCount = await User.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    // Format families into the frontend Users interface
    const formatted = families.map((family) => {
      const [firstName = "", ...rest] = family.name?.split(" ") ?? [];
      const lastName = rest.join(" ");
      const cityStateParts = family.location?.format_location?.split(", ") ?? [];

      const avgRating =
        family.reviews?.length > 0
          ? family.reviews.reduce((acc, r) => acc + r.rating, 0) / family.reviews.length
          : 0;

      return {
        id: family._id,
        username: family.email.split("@")[0],
        email: family.email,
        firstName,
        lastName,
        role: "Parents",
        profileImage: family.imageUrl || null,
        phone: family.phoneNo || "",
        city: cityStateParts[cityStateParts.length - 3] || "",
        state: cityStateParts[cityStateParts.length - 2] || "",
        hourlyRate: undefined,
        bio: family.aboutMe || "",
        avgRating: parseFloat(avgRating.toFixed(1)),
        totalReviews: family.reviews?.length || 0,
        isVerifiedEmail: family.verified?.emailVer || false,
        isVerifiedID: family.verified?.nationalIDVer === "true",
        isActive: family.status === "Active",
        createdAt: family.createdAt,
      };
    });

    return res.status(200).json({
      data: formatted,
      pagination: {
        totalRecords: totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch families",
      error: error.message,
    });
  }
});


router.get("/nannies", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.type !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const query = { type: 'Nanny' };

    const nannies = await User.find(query)
      .select("-password -otp -otpExpiry -notifications -__v -online") // sanitize
      .skip(skip)
      .limit(limit)
      .lean();

    const totalCount = await User.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    // Transform MongoDB User -> Frontend Nanny interface
    const formatted = nannies.map((nanny) => {
      const [firstName, ...rest] = nanny.name?.split(" ") ?? [];
      const lastName = rest.join(" ");
      const cityState = nanny.location?.format_location?.split(", ") ?? [];
      const avgRating = nanny.reviews.length > 0
        ? nanny.reviews.reduce((sum, r) => sum + r.rating, 0) / nanny.reviews.length
        : 0;

      return {
        id: nanny._id,
        username: nanny.email.split("@")[0],
        email: nanny.email,
        firstName,
        lastName,
        role: "Nanny",
        profileImage: nanny.imageUrl || null,
        phone: nanny.phoneNo || "",
        city: cityState[cityState.length - 3] || "",
        state: cityState[cityState.length - 2] || "",
        hourlyRate: undefined, // you can derive this from additionalInfo if needed
        bio: nanny.additionalInfo.find(info => info.key === "jobDescription").value || "",
        avgRating: avgRating,
        totalReviews: nanny.reviews.length,
        isVerifiedEmail: nanny.verified?.emailVer || false,
        isVerifiedID: nanny.verified?.nationalIDVer === "true",
        isActive: nanny.status === "Active",
        createdAt: nanny.createdAt,
      };
    });

    res.status(200).json({
      data: formatted,
      pagination: {
        totalRecords: totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});


router.get("/getAllData/admin", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the logged-in user is an admin
    if (user.type !== "Admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Only Admins can get data." });
    }

    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const page = parseInt(req.query.page) || 1; // Default page is 1
    const skip = (page - 1) * limit; // Calculate the number of records to skip

    const userType = req.query.userType || null; // Get userType from query, default is null

    // Query to exclude admins and filter by userType if provided
    const query = {};
    if (userType) {
      query.type = userType;
    } else {
      query.type = { $ne: "Admin" }; // Exclude admins
    }

    // Fetch users with pagination
    const users = await User.find(query)
      .select("-password -online -ActiveAt -verified -entity") // Exclude sensitive fields
      .skip(skip) // Pagination: Skip records
      .limit(limit) // Pagination: Limit records per page
      .lean(); // Convert the result to plain JS objects

    // Count total users matching the query (ignoring skip/limit for pagination metadata)
    const totalCount = await User.countDocuments(query);

    const totalPages = Math.ceil(totalCount / limit); // Calculate total pages

    // Respond with the paginated user list and metadata
    return res.status(200).send({
      status: 200,
      data: users,
      pagination: {
        totalRecords: totalCount, // Total number of matching records
        totalPages, // Total number of pages
        currentPage: page, // Current page number
        limit, // Records per page
      },
    });
  } catch (err) {
    // Handle errors
    return res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
});

router.get("/getById/admin/:id", authMiddleware, async (req, res) => {
  try {
    const adminId = req.userId; // Extract admin ID from auth middleware
    const { id } = req.params; // Extract the user ID from route parameters

    // Find the admin user
    const adminUser = await User.findById(adminId);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Ensure the logged-in user is an admin
    if (adminUser.type !== "Admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Only Admins can access user data." });
    }

    // Find the user by ID, excluding sensitive fields
    const user = await User.findById(id)
      .select("-password -online -ActiveAt -verified -entity") // Exclude sensitive fields
      .lean(); // Convert to plain JS object for easier manipulation

    // If user not found, return 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user's details
    return res.status(200).json({
      status: 200,
      data: user,
      message: "user edit sucessfully",
    });
  } catch (err) {
    // Handle server errors
    return res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

export default router;
