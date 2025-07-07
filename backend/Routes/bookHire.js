import express from "express";
import User from "../Schema/user.js";
import Booking from "../Schema/booking.js";
import PostJob from "../Schema/postJob.js";
import { authMiddleware } from "../Services/utils/middlewareAuth.js";
import { sendEmail } from "../Services/email/email.js";
import Notification from "../Schema/notificaion.js";

const router = express.Router();

// Endpoint to send a booking request

const calculateDays = (specificDaysAndTime, startAt, endAt) => {
  const startDate = new Date(startAt); // Start date
  const endDate = new Date(endAt); // End date (current time)
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)); // Total days between dates

  // Get all dates within the range
  const datesInRange = Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i); // Increment day by day
    return date;
  });

  let activeDays = 0;
  let totalMinutes = 0;

  datesInRange.forEach((date) => {
    const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" }); // Get day name
    if (specificDaysAndTime.value[dayOfWeek]?.checked) {
      // Accessing `value` to get the correct object
      const dayData = specificDaysAndTime.value[dayOfWeek];
      // Parse start and end times
      const startTime = new Date(dayData.start);
      const endTime = new Date(dayData.end);

      // Calculate the difference in minutes
      const minutesSpent = (endTime - startTime) / (1000 * 60 * 60); // Difference in milliseconds to minutes

      // Add to the total
      totalMinutes += minutesSpent;
      activeDays++; // Increment if the day is checked
    }
  });

  return totalMinutes;
};

router.post("/request", authMiddleware, async (req, res) => {
  const userId = req.userId; // ID of the authenticated user
  const { jobId } = req.body; // ID of the user receiving the request

  try {
    // Fetch the authenticated user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the receiver (the user to whom the request is being sent)

    const job = await PostJob.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const parent = User.findById(job.user);
    if (!parent) {
      return res.status(404).json({ message: "Parents not found" });
    }

    const existingCompleteBooking = await Booking.findOne({
      $or: [{ jobId, status: "completed" }],
    });

    if (existingCompleteBooking) {
      return res.status(400).json({ message: "Already Hired" });
    }

    // Determine the relationship type between users
    let bookingData = {
      status: "pending",
      isPaid: false,
      requestBy: userId,
      jobId,
      createdAt: new Date(),
    };

    const existingRejectedBooking = await Booking.findOne({
      $or: [{ requestBy: userId, jobId, status: "rejected" }],
    });

    if (existingRejectedBooking) {
      const rejectedAtDate = new Date(existingRejectedBooking.rejectedAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      if (rejectedAtDate > thirtyDaysAgo) {
        // Less than 30 days have passed
        const diffInDays = Math.ceil(
          (new Date() - rejectedAtDate) / (1000 * 60 * 60 * 24)
        );
        return res.status(400).json({
          message: `Rejected booking exists. You can reapply after ${
            30 - diffInDays
          } day(s).`,
        });
      } else {
        // 30+ days have passed → allow reapplication
        existingRejectedBooking.status = "pending";
        await existingRejectedBooking.save();
        await Notification.findOneAndDelete({
          bookingId: existingRejectedBooking._id,
          receiverId: userId,
          content: "Reject your request",
        });

        return res.status(200).json({
          message: "Booking request re-sent successfully",
          booking: existingRejectedBooking,
        });
      }
    }

    const existingPendingBooking = await Booking.findOne({
      $or: [{ requestBy: userId, jobId, status: "pending" }],
    });

    if (existingPendingBooking) {
      return res
        .status(400)
        .json({ message: "A pending booking already exists" });
    }

    const existingWithdrawBooking = await Booking.findOne({
      requestBy: userId,
      jobId,
      status: "withdraw",
    });

    if (existingWithdrawBooking) {
      // Update status to 'pending'
      existingWithdrawBooking.status = "pending";
      await existingWithdrawBooking.save();

      return res.status(200).json({
        message: "Booking status updated to pending",
        booking: existingWithdrawBooking,
      });
    }

    const existingAccBooking = await Booking.findOne({
      $or: [{ requestBy: userId, jobId, status: "accepted" }],
    });

    if (existingAccBooking) {
      return res
        .status(400)
        .json({ message: "A accepted booking already exists" });
    }

    const existingCompletedBooking = await Booking.findOne({
      $or: [
        { requestBy: userId, jobId, status: "completed", nannyReview: false },
      ],
    });

    if (existingCompletedBooking) {
      sendEmail(
        user.email,
        "✅ Your Job is Complete! Leave a Review ⭐",
        `<div style="padding: 12px">
                <h2 style="color: #28a745;">Your Job with ${parent.name} is Complete!</h2>
                <p>We hope everything went smoothly! 🚀</p>
                <p><strong>Next Step:</strong> Please take a moment to leave a review and share your feedback.</p>
                <br>
                <a href="https://famylink.us/nanny/application" style="padding: 10px 15px; background: #F98300; color: white; text-decoration: none; border-radius: 5px;">Leave a Review</a>
                <br><br>
                <p style="font-size: 14px; color: #555;">
                  Need help? Contact us at <a href="mailto:info@famylink.us">info@famylink.us</a>
                </p>
              </div>`
      );
      return res.status(400).json({
        message:
          "Your previous booking is completed but waiting for review from nanny",
      });
    }
    // if (user.type === 'Parents') {
    //   // Check if booking is completed but nanny has not left a review
    //   const existingCompletedBooking = await Booking.findOne({
    //     $or: [
    //       {
    //         nannyId: userId,
    //         familyId: receiverId,
    //         status: 'completed',
    //         nannyReview: false
    //       },
    //       {
    //         nannyId: receiverId,
    //         familyId: userId,
    //         status: 'completed',
    //         nannyReview: false
    //       }
    //     ]
    //   })
    //   if (existingCompletedBooking) {
    //     sendEmail(
    //       receiver.email,
    //       '✅ Your Job is Complete! Leave a Review ⭐',
    //       `<div style="padding: 12px">
    //         <h2 style="color: #28a745;">Your Job with ${user.name} is Complete!</h2>
    //         <p>We hope everything went smoothly! 🚀</p>
    //         <p><strong>Next Step:</strong> Please take a moment to leave a review and share your feedback.</p>
    //         <br>
    //         <a href="https://famylink.us/nanny/application" style="padding: 10px 15px; background: #F98300; color: white; text-decoration: none; border-radius: 5px;">Leave a Review</a>
    //         <br><br>
    //         <p style="font-size: 14px; color: #555;">
    //           Need help? Contact us at <a href="mailto:info@famylink.us">info@famylink.us</a>
    //         </p>
    //       </div>`
    //     )
    //     return res.status(400).json({
    //       message:
    //         'Your previous booking is completed but waiting for review from nanny'
    //     })
    //   }
    //   // Check if booking is completed, reviewed by nanny, paid, but missing family review
    //   const existingCompletedParBooking = await Booking.findOne({
    //     $or: [
    //       {
    //         nannyId: userId,
    //         familyId: receiverId,
    //         status: 'completed',
    //         nannyReview: true,
    //         familyReview: false
    //       },
    //       {
    //         nannyId: receiverId,
    //         familyId: userId,
    //         status: 'completed',
    //         nannyReview: true,
    //         familyReview: false
    //       }
    //     ]
    //   })
    //   if (existingCompletedParBooking) {
    //     return res.status(400).json({
    //       message:
    //         "Your previous booking is completed but still you haven't given a review"
    //     })
    //   }
    // } else if (user.type === 'Nanny') {
    //   // Check if booking is completed but nanny has not left a review
    //   const existingCompletedBookingForNanny = await Booking.findOne({
    //     $or: [
    //       {
    //         nannyId: userId,
    //         familyId: receiverId,
    //         status: 'completed',
    //         nannyReview: false
    //       },
    //       {
    //         nannyId: receiverId,
    //         familyId: userId,
    //         status: 'completed',
    //         nannyReview: false
    //       }
    //     ]
    //   })
    //   if (existingCompletedBookingForNanny) {
    //     return res.status(400).json({
    //       message:
    //         'Your previous booking is completed but still requires your review'
    //     })
    //   }

    //   // Check if booking is completed and either payment or family review is pending (for informational purposes)
    //   const pendingPaymentOrReview = await Booking.findOne({
    //     $or: [
    //       {
    //         nannyId: userId,
    //         familyId: receiverId,
    //         status: 'completed',
    //         familyReview: false
    //       },
    //       {
    //         nannyId: receiverId,
    //         familyId: userId,
    //         status: 'completed',
    //         familyReview: false
    //       }
    //     ]
    //   })
    //   if (pendingPaymentOrReview) {
    //     sendEmail(
    //       receiver.email,
    //       '✅ Your Booking is Complete! Leave a Review ⭐',
    //       `<div style="padding: 12px">
    //         <h2 style="color: #28a745;">Your Booking with ${user.name} is Complete!</h2>
    //         <p>We hope everything went smoothly! 🚀</p>
    //         <p><strong>Next Step:</strong> Please take a moment to leave a review and share your feedback.</p>
    //         <br>
    //         <a href="https://famylink.us/family/application" style="padding: 10px 15px; background: #F98300; color: white; text-decoration: none; border-radius: 5px;">Leave a Review</a>
    //         <br><br>
    //         <p style="font-size: 14px; color: #555;">
    //           Need help? Contact us at <a href="mailto:info@famylink.us">info@famylink.us</a>
    //         </p>
    //       </div>`
    //     )
    //     return res.status(400).json({
    //       message:
    //         'Your previous booking is completed, but waiting review from the parents'
    //     })
    //   }
    // }

    // Create a new booking request
    const newBooking = new Booking(bookingData);
    await newBooking.save();
    // if (receiver.type == 'Nanny') {
    //   sendEmail(receiver.email, 'Your Services Are in Demand! 💼✨', `<div style="padding: 12px">
    //      <h2 style="color: #ff6600;">Exciting News, from ${user.name}!</h2>
    // <p>Someone has just sent you a request for your amazing nanny services. 🎉</p>
    // <p>We know how valuable your expertise is, and families are eager to connect with you.</p>
    // <p><strong>Next Step:</strong> Log in now and review the request to respond promptly!</p>
    //            <br>
    //     <a href="https://famylink.us/nanny/booking" style="padding: 10px 15px; background: #F98300; color: white; text-decoration: none; border-radius: 5px;">View Request</a>
    //    <br><br>
    //   <p style="font-size: 14px; color: #555;">Need help? Contact us at <a href="mailto:${`info@famylink.us`}">${`info@famylink.us`}</a></p>
    //     </div>
    //   `)
    // }
    // else if (receiver.type === 'Parents') {
    //   sendEmail(
    //     receiver.email,
    //     `You Have a New Request! 👶💙`,
    //     `<div style="padding: 12px; font-family: Arial, sans-serif; color: #333;">
    //       <h2 style="color: #ff6600;">Exciting News, from ${user.name}! 👋</h2>
    //       <p>Great news! A nanny has responded to your job description and is ready to assist you. 🎉</p>
    //       <p>We understand how important finding the right nanny is for your family, and we're here to help you every step of the way.</p>

    //       <p><strong>What’s Next?</strong> Click the button below to review the request and take the next step.</p>

    //       <br>
    //       <a href="https://famylink.us/family/booking"
    //          style="padding: 12px 20px; background: #F98300; color: white; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 6px;">
    //          View Request
    //       </a>
    //       <br><br>

    //       <p style="font-size: 14px; color: #555;">Need help? Contact us at
    //         <a href="mailto:info@famylink.us" style="color: #14558F; text-decoration: none;">info@famylink.us</a>
    //       </p>

    //       <p style="font-size: 12px; color: #777;">Best Regards, <br><strong>The Famylink Team</strong></p>
    //     </div>`
    //   );
    // }

    return res.status(200).json({
      message: "Booking request sent successfully",
      booking: newBooking,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/requested-data", authMiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    // Check if limit and page are specified in the query
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const page = req.query.page ? parseInt(req.query.page) : null;
    const skip = page && limit ? (page - 1) * limit : 0;

    // Determine which field to populate based on the role
    const queryConditions = [
      { nannyId: userId, requestBy: userId },
      { familyId: userId, requestBy: userId },
    ];

    const populateField = (await Booking.findOne({ nannyId: userId }))
      ? "familyId"
      : "nannyId";

    // Create query options with sorting
    let queryOptions = Booking.find({
      $or: queryConditions,
    })
      .populate(
        populateField,
        "name email type location imageUrl additionalInfo"
      ) // Populate opposing user data
      .sort("-createdAt"); // Sort by createdAt in descending order

    // Apply skip and limit only if they are specified
    if (limit) queryOptions = queryOptions.skip(skip).limit(limit);

    const bookings = await queryOptions.lean();

    // If no pagination, calculate totalCount only if needed
    const totalCount = limit
      ? await Booking.countDocuments({
          $or: queryConditions,
        })
      : bookings.length;

    const totalPages = limit ? Math.ceil(totalCount / limit) : 1; // Calculate total pages only if limit is provided

    // Send the results, including pagination info only if pagination is applied
    return res.status(200).json({
      message: "Booking requests retrieved successfully",
      data: bookings,
      pagination: limit
        ? {
            totalRecords: totalCount,
            totalPages,
            currentPage: page,
            recordsPerPage: limit,
          }
        : undefined,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/getPendingRequests", authMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const skip = (page - 1) * limit;

    let pendingBookings = [];
    let total = 0;

    if (user.type === "Nanny") {
      // Nanny: requestBy should be current user
      pendingBookings = await Booking.find({
        status: "pending",
        requestBy: userId,
      })
        .sort("-createdAt")
        .skip(skip)
        .limit(limit)
        .populate({
          path: "jobId",
          populate: {
            path: "user",
            select: "imageUrl name email noOfChildren zipCode location",
          },
        })
        .populate("requestBy", "name email zipCode location imageUrl additionalInfo");

      total = await Booking.countDocuments({
        status: "pending",
        requestBy: userId,
      });
    } else if (user.type === "Parents") {
      // Parents: fetch jobs where user is the poster
      const jobs = await PostJob.find({ user: userId }).select("_id");
      const jobIds = jobs.map((job) => job._id);

      pendingBookings = await Booking.find({
        status: "pending",
        jobId: { $in: jobIds },
      })
        .sort("-createdAt")
        .skip(skip)
        .limit(limit)
        .populate({
          path: "jobId",
          populate: {
            path: "user",
            select: "imageUrl name email noOfChildren zipCode location",
          },
        })
        .populate("requestBy", "name email zipCode location imageUrl additionalInfo");

      total = await Booking.countDocuments({
        status: "pending",
        jobId: { $in: jobIds },
      });
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    // Filter jobId fields to only include the jobType-specific section
    const filteredData = pendingBookings.map((booking) => {
      const job = booking.jobId;
      const jobType = job?.jobType;
      const jobDetails = job?.[jobType] || {}; // e.g., job.privateEducator

      return {
        ...booking.toObject(),
        jobId: {
          _id: job._id,
          jobType: job.jobType,
          user: job.user,
          createdAt: job.createdAt,
          updatedAt: job.updatedAt,
          [jobType]: jobDetails, // only return the selected jobType section
        },
      };
    });

    return res.status(200).json({
      data: filteredData,
      pagination: { page, limit, total },
    });
  } catch (error) {
    console.error("Error getting pending requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/get-withdraw-requests", authMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.type == "Nanny") {
      return res.status(404).json({ message: "You aren't authorized" });
    }

    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const skip = (page - 1) * limit;

    let pendingBookings = [];
    let total = 0;

    pendingBookings = await Booking.find({
      status: "withdraw",
      requestBy: userId,
    })
      .sort("-createdAt")
      .skip(skip)
      .limit(limit)
      .populate({
        path: "jobId",
        populate: {
          path: "user",
          select: "imageUrl name email noOfChildren zipCode location",
        },
      })
      .populate("requestBy", "name email zipCode location imageUrl additionalInfo");

    total = await Booking.countDocuments({
      status: "withdraw",
      requestBy: userId,
    });

    // Filter jobId fields to only include the jobType-specific section
    const filteredData = pendingBookings.map((booking) => {
      const job = booking.jobId;
      const jobType = job?.jobType;
      const jobDetails = job?.[jobType] || {}; // e.g., job.privateEducator

      return {
        ...booking.toObject(),
        jobId: {
          _id: job._id,
          jobType: job.jobType,
          user: job.user,
          createdAt: job.createdAt,
          updatedAt: job.updatedAt,
          [jobType]: jobDetails, // only return the selected jobType section
        },
      };
    });

    return res.status(200).json({
      data: filteredData,
      pagination: { page, limit, total },
    });
  } catch (error) {
    console.error("Error getting pending requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/status", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { jobId } = req.query; 

  try {
    const currentBooking = await Booking.findOne({ jobId }).populate("jobId");

    if (!currentBooking) {
      return res
        .status(404)
        .json({ message: "Booking not found for this jobId" });
    }

    // Get user and their type
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const type = user.type;

    // Check if user is related to this job
    const isNanny =
      type === "Nanny" && currentBooking.requestBy.toString() === userId;
    const isParent =
      type === "Parents" &&
      currentBooking.jobId &&
      currentBooking.jobId.user &&
      currentBooking.jobId.user.toString() === userId;

    if (!isNanny && !isParent) {
      return res
        .status(403)
        .json({ message: "User is not part of this booking" });
    }

    // Build query for all bookings related to this jobId
    const query = {
      jobId,
      $or: [{ nannyReview: false }, { familyReview: false }],
    };

    const bookings = await Booking.find(query).populate("jobId");

    if (!bookings.length) {
      return res.status(404).json({ message: "No relevant bookings found" });
    }
    const response = bookings.map((booking) => ({
      status: booking.status,
      booking,
    }));

    return res.status(200).json({
      message: "Bookings retrieved successfully",
      bookings: response,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/withdraw/:bookingId", authMiddleware, async (req, res) => {
  const userId = req.userId; // Get the ID of the authenticated user
  const { bookingId } = req.params; // The ID of the booking to withdraw

  try {
    // Fetch the booking based on the booking ID
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the current user is in requestBy
    if (booking.requestBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to withdraw this request" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        message: "Booking is not in pending status",
        type: booking.status,
      });
    }

    // Delete the booking
    booking.status = "withdraw";
    await booking.save();

    await Notification.findOneAndDelete({
      bookingId,
      senderId: userId,
      content: "Send request",
    });

    return res
      .status(200)
      .json({ message: "Booking request withdrawn successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/accept-request/:bookingId", authMiddleware, async (req, res) => {
  const { bookingId } = req.params;
  const currentUserId = req.userId; // from auth middleware

  try {
    // Step 1: Find booking with populated jobId
    const booking = await Booking.findById(bookingId)
      .populate("jobId")
      .populate("requestBy");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log(booking.jobId._id);

    const existingCompleteBooking = await Booking.findOne({
      $or: [{ jobId: booking.jobId._id, status: "completed" }],
    });

    if (existingCompleteBooking) {
      return res
        .status(400)
        .json({ message: "You already hired candidates for this job" });
    }

    if (booking.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Booking is not in pending status" });
    }

    // Step 2: Prevent user from accepting their own request
    if (booking.requestBy._id.toString() === currentUserId) {
      return res
        .status(403)
        .json({ message: "You cannot accept your own booking request" });
    }

    // Step 3: Ensure current user is the one who posted the job (jobId.user)
    if (
      !booking.jobId.user ||
      booking.jobId.user.toString() !== currentUserId
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
    }

    const parents = await User.findById(booking.jobId.user);
    // Step 4: Accept booking
    booking.status = "completed";
    booking.startAt = new Date();
    await booking.save();

    // Step 5: Send email
    sendEmail(
      booking.requestBy.email,
      "🎉 Your Request Has Been Accepted!",
      `<div style="padding: 12px">
        <h2 style="color: #28a745;">Great News, from ${parents.name}!</h2>
        <p>Your request for a job has been accepted! 🥳</p>
        <p><strong>Next Step:</strong> Log in now to finalize the details.</p>
        <br>
        <a href="https://famylink.us/nanny/booking" style="padding: 10px 15px; background: #F98300; color: white; text-decoration: none; border-radius: 5px;">View Application</a>
        <br><br>
        <p style="font-size: 14px; color: #555;">
          Need help? Contact us at <a href="mailto:info@famylink.us">info@famylink.us</a>
        </p>
      </div>`
    );

    return res
      .status(200)
      .json({ message: "Booking accepted successfully", booking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

router.put("/reject-request/:bookingId", authMiddleware, async (req, res) => {
  const { bookingId } = req.params;
  const currentUserId = req.userId; // from auth middleware

  try {
    // Step 1: Find booking with populated jobId
    const booking = await Booking.findById(bookingId)
      .populate("jobId")
      .populate("requestBy");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Booking is not in pending status" });
    }

    // Step 2: Prevent user from accepting their own request
    if (booking.requestBy._id.toString() === currentUserId) {
      return res
        .status(403)
        .json({ message: "You cannot accept your own booking request" });
    }

    // Step 3: Ensure current user is the one who posted the job (jobId.user)
    if (
      !booking.jobId.user ||
      booking.jobId.user.toString() !== currentUserId
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
    }

    const parents = await User.findById(booking.jobId.user);
    // Step 4: Accept booking
    booking.status = "rejected";
    booking.rejectedAt = new Date();
    await booking.save();

    sendEmail(
      booking.requestBy.email,
      "❌ Your Request Has Been Canceled",
      `<div style="padding: 12px">
        <h2 style="color: #f71109;">Important Update from ${parents.name}</h2>
        <p>Unfortunately, your request for a nanny has been canceled. 😞</p>
        <p><strong>Next Step:</strong> You can submit a new request or explore other options.</p>
        <br>
        <a href="https://famylink.us/family" style="padding: 10px 15px; background: #d9534f; color: white; text-decoration: none; border-radius: 5px;">Hire Boord</a>
        <br><br>
        <p style="font-size: 14px; color: #555;">
          Need help? Contact us at <a href="mailto:info@famylink.us">info@famylink.us</a>
        </p>
      </div>`
    );

    return res
      .status(200)
      .json({ message: "Booking rejected successfully", booking });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while rejecting the booking" });
  }
});

router.put("/cancel-booking/:bookingId", authMiddleware, async (req, res) => {
  const { bookingId } = req.params;
  const currentUserId = req.userId; // Get current user ID from auth middleware

  try {
    // Find the booking by ID
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "accepted") {
      return res
        .status(400)
        .json({ message: "Booking is not in pending status" });
    }

    // Ensure the current user matches either familyId or nannyId
    if (
      booking.familyId.toString() !== currentUserId &&
      booking.nannyId.toString() !== currentUserId
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to reject this booking" });
    }

    const currentUser = await User.findById(currentUserId);
    const family = await User.findById(booking.familyId);
    const nanny = await User.findById(booking.nannyId);

    // Update the status to "rejected"
    booking.status = "rejected";
    booking.rejectedBy = currentUserId;
    await booking.save();

    if (currentUser.type == "Nanny") {
      sendEmail(
        family.email,
        "❌ Your Booking has been Canceled",
        `<div style="padding: 12px">
          <h2 style="color: #f71109;">Important Update from ${currentUser.name}</h2>
          <p>Unfortunately, your bokking for a nanny has been canceled. 😞</p>
          <p><strong>Next Step:</strong> You can submit a new request or explore other options.</p>
          <br>
          <a href="https://famylink.us/family" style="padding: 10px 15px; background: #d9534f; color: white; text-decoration: none; border-radius: 5px;">Hire Board</a>
          <br><br>
          <p style="font-size: 14px; color: #555;">
            Need help? Contact us at <a href="mailto:info@famylink.us">info@famylink.us</a>
          </p>
        </div>`
      );
    } else if (currentUser.type === "Parents") {
      sendEmail(
        nanny.email,
        "❌ Your Booking has been Canceled",
        `<div style="padding: 12px">
          <h2 style="color: #f71109;">Important Update from ${currentUser.name}</h2>
          <p>Unfortunately, your booking has been canceled. 😞</p>
          <p><strong>Next Step:</strong> You can explore other job opportunities.</p>
          <br>
          <a href="https://famylink.us/nanny" style="padding: 10px 15px; background: #d9534f; color: white; text-decoration: none; border-radius: 5px;">Job Board</a>
          <br><br>
          <p style="font-size: 14px; color: #555;">
            Need help? Contact us at <a href="mailto:info@famylink.us">info@famylink.us</a>
          </p>
        </div>`
      );
    }

    return res
      .status(200)
      .json({ message: "Booking rejected successfully", booking });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while rejecting the booking" });
  }
});

router.put("/complete-booking/:bookingId", authMiddleware, async (req, res) => {
  const { bookingId } = req.params;
  const currentUserId = req.userId; // Get current user ID from auth middleware

  try {
    // Find the booking by ID
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "accepted") {
      return res
        .status(400)
        .json({ message: "Booking is not in pending status" });
    }

    // Ensure the current user matches either familyId or nannyId
    if (
      booking.familyId.toString() !== currentUserId &&
      booking.nannyId.toString() !== currentUserId
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to reject this booking" });
    }

    const requested = await User.findById(booking.requestBy);

    if (requested.type == "Nanny") {
      const parents = await User.findById(booking.familyId, "additionalInfo");
      const nanny = await User.findById(booking.nannyId, "additionalInfo");
      const specificDaysAndTime = parents.additionalInfo.find(
        (info) => info.key === "specificDaysAndTime"
      );
      const noOfChildren = Object.keys(
        parents.additionalInfo.find((info) => info.key === "noOfChildren")
          ?.value
      ).length;

      const endAt = new Date().toISOString();
      const result = calculateDays(specificDaysAndTime, booking.startAt, endAt);
      const rate = nanny.additionalInfo.find(
        (info) => info.key === "salaryExp"
      )?.value;
      let childRate;
      if (noOfChildren === 1) {
        childRate = rate.firstChild;
      } else if (noOfChildren === 2) {
        childRate = rate.secChild;
      } else if (noOfChildren === 3) {
        childRate = rate.thirdChild;
      } else if (noOfChildren === 4) {
        childRate = rate.fourthChild;
      } else if (noOfChildren >= 5) {
        childRate = rate.fiveOrMoreChild;
      } else {
        childRate = "No rate available"; // Handle edge cases
      }
      const salary = Math.round(childRate * result);
      booking.status = "completed";
      booking.completedBy = currentUserId;
      booking.totalPayment = salary;
      booking.completedAt = new Date();
      await booking.save();
    }

    if (requested.type == "Parents") {
      const nanny = await User.findById(booking.nannyId, "additionalInfo");
      const parents = await User.findById(booking.familyId, "additionalInfo");
      const specificDaysAndTime = nanny.additionalInfo.find(
        (info) => info.key === "specificDaysAndTime"
      );
      const noOfChildren = Object.keys(
        parents.additionalInfo.find((info) => info.key === "noOfChildren")
          ?.value
      ).length;

      const endAt = new Date().toISOString();
      const result = calculateDays(specificDaysAndTime, booking.startAt, endAt);
      const rate = nanny.additionalInfo.find(
        (info) => info.key === "salaryExp"
      )?.value;
      let childRate;
      if (noOfChildren === 1) {
        childRate = rate.firstChild;
      } else if (noOfChildren === 2) {
        childRate = rate.secChild;
      } else if (noOfChildren === 3) {
        childRate = rate.thirdChild;
      } else if (noOfChildren === 4) {
        childRate = rate.fourthChild;
      } else if (noOfChildren >= 5) {
        childRate = rate.fiveOrMoreChild;
      } else {
        childRate = "No rate available"; // Handle edge cases
      }

      const salary = Math.round(childRate * result);
      booking.status = "completed";
      booking.completedBy = currentUserId;
      booking.totalPayment = salary;
      booking.completedAt = new Date();
      await booking.save();
    }

    const currentUser = await User.findById(currentUserId);
    const family = await User.findById(booking.familyId);
    const nanny = await User.findById(booking.nannyId);

    if (currentUser.type == "Nanny") {
      sendEmail(
        family.email,
        "✅ Your Booking is Complete! Leave a Review ⭐",
        `<div style="padding: 12px">
          <h2 style="color: #28a745;">Your Booking with ${currentUser.name} is Complete!</h2>
          <p>We hope you had a great experience! 🎉</p>
          <p><strong>Next Step:</strong> Please take a moment to leave a review and share your feedback.</p>
          <br>
          <a href="https://famylink.us/family/booking" style="padding: 10px 15px; background: #F98300; color: white; text-decoration: none; border-radius: 5px;">Leave a Review</a>
          <br><br>
          <p style="font-size: 14px; color: #555;">
            Need help? Contact us at <a href="mailto:info@famylink.us">info@famylink.us</a>
          </p>
        </div>`
      );
    } else if (currentUser.type === "Parents") {
      sendEmail(
        nanny.email,
        "✅ Your Job is Complete! Leave a Review ⭐",
        `<div style="padding: 12px">
          <h2 style="color: #28a745;">Your Job with ${currentUser.name} is Complete!</h2>
          <p>We hope everything went smoothly! 🚀</p>
          <p><strong>Next Step:</strong> Please take a moment to leave a review and share your feedback.</p>
          <br>
          <a href="https://famylink.us/nanny/booking" style="padding: 10px 15px; background: #F98300; color: white; text-decoration: none; border-radius: 5px;">Leave a Review</a>
          <br><br>
          <p style="font-size: 14px; color: #555;">
            Need help? Contact us at <a href="mailto:info@famylink.us">info@famylink.us</a>
          </p>
        </div>`
      );
    }

    // Update the status to "rejected"

    return res
      .status(200)
      .json({ message: "Booking completed successfully", booking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/accepted-bookings-request", authMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    // Set pagination values, if provided in the query
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const page = req.query.page ? parseInt(req.query.page) : null;
    const skip = page && limit ? (page - 1) * limit : 0;

    // Define the main query conditions
    const queryConditions = {
      status: "accepted", // Ensure current user is the requester
      $or: [{ nannyId: userId }, { familyId: userId }],
    };

    // Determine which field to populate based on the user's role
    const populateField = (await Booking.findOne({ nannyId: userId }))
      ? "familyId"
      : "nannyId";

    // Build query with sorting and population
    let queryOptions = Booking.find(queryConditions)
      .populate(
        populateField,
        "name email type zipCode location imageUrl additionalInfo"
      ) // Populate opposite role's data
      .sort("-createdAt"); // Sort by createdAt in descending order

    // Apply pagination if limit is provided
    if (limit) queryOptions = queryOptions.skip(skip).limit(limit);

    const bookings = await queryOptions.lean();

    // Calculate total count for pagination
    const totalCount = limit
      ? await Booking.countDocuments(queryConditions)
      : bookings.length;
    const totalPages = limit ? Math.ceil(totalCount / limit) : 1;

    // Send response with pagination details if pagination was applied
    return res.status(200).json({
      message: "Accepted bookings retrieved successfully",
      data: bookings,
      pagination: limit
        ? {
            totalRecords: totalCount,
            totalPages,
            currentPage: page,
            recordsPerPage: limit,
          }
        : undefined,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/completed-bookings-request", authMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const skip = (page - 1) * limit;

    let completeBookings = [];
    let total = 0;

    if (user.type === "Nanny") {
      // Nanny: requestBy should be current user
      completeBookings = await Booking.find({
        status: "completed",
        requestBy: userId,
      })
        .sort("-createdAt")
        .skip(skip)
        .limit(limit)
        .populate({
          path: "jobId",
          populate: {
            path: "user",
            select: "imageUrl name email noOfChildren zipCode location",
          },
        })
        .populate("requestBy", "name email zipCode location imageUrl additionalInfo");

      total = await Booking.countDocuments({
        status: "completed",
        requestBy: userId,
      });
    } else if (user.type === "Parents") {
      // Parents: fetch jobs where user is the poster
      const jobs = await PostJob.find({ user: userId }).select("_id");
      const jobIds = jobs.map((job) => job._id);

      completeBookings = await Booking.find({
        status: "completed",
        jobId: { $in: jobIds },
      })
        .sort("-createdAt")
        .skip(skip)
        .limit(limit)
        .populate({
          path: "jobId",
          populate: {
            path: "user",
            select: "imageUrl name email noOfChildren zipCode location",
          },
        })
        .populate("requestBy", "name email zipCode location imageUrl additionalInfo");

      total = await Booking.countDocuments({
        status: "completed",
        jobId: { $in: jobIds },
      });
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    // Filter jobId fields to only include the jobType-specific section
    const filteredData = completeBookings.map((booking) => {
      const job = booking.jobId;
      const jobType = job?.jobType;
      const jobDetails = job?.[jobType] || {}; // e.g., job.privateEducator

      return {
        ...booking.toObject(),
        jobId: {
          _id: job._id,
          jobType: job.jobType,
          user: job.user,
          createdAt: job.createdAt,
          updatedAt: job.updatedAt,
          [jobType]: jobDetails, // only return the selected jobType section
        },
      };
    });

    return res.status(200).json({
      data: filteredData,
      pagination: { page, limit, total },
    });
  } catch (error) {
    console.error("Error getting pending requests:", error);
    res.status(500).json({ message: error.msg });
  }
});

router.get("/rejected-bookings-request", authMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Check for Parents type (your current logic mistakenly checks for Nanny)
    if (user.type !== "Parents") {
      return res.status(403).json({ message: "You aren't authorized" });
    }

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // ✅ Find bookings that are rejected AND whose job.user matches current user
    const bookings = await Booking.find({
      status: "rejected",
    })
      .populate({
        path: "jobId",
        match: { user: userId }, // ✅ only include jobs where user is the current parent
        populate: {
          path: "user",
          select: "imageUrl name email noOfChildren zipCode location",
        },
      })
      .populate("requestBy", "name email zipCode location imageUrl additionalInfo")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    // Filter out null jobIds (when match fails)
    const filteredBookings = bookings.filter((b) => b.jobId);

    const total = await Booking.countDocuments({
      status: "rejected",
    });

    const filteredData = filteredBookings.map((booking) => {
      const job = booking.jobId;
      const jobType = job?.jobType;
      const jobDetails = job?.[jobType] || {};

      return {
        ...booking.toObject(),
        jobId: {
          _id: job._id,
          jobType: job.jobType,
          user: job.user,
          createdAt: job.createdAt,
          updatedAt: job.updatedAt,
          [jobType]: jobDetails,
        },
      };
    });

    return res.status(200).json({
      data: filteredData,
      pagination: { page, limit, total: filteredBookings.length },
    });
  } catch (error) {
    console.error("Error getting rejected requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put(
  "/reconsider-booking/:bookingId",
  authMiddleware,
  async (req, res) => {
    const { bookingId } = req.params;
    const currentUserId = req.userId;

    try {
      const user = await User.findById(currentUserId);

      if (!user || user.type !== "Parents") {
        return res
          .status(403)
          .json({ message: "Only parents can reconsider bookings" });
      }
      
      const booking = await Booking.findById(bookingId).populate("jobId");

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (booking.status !== "rejected") {
        return res.status(400).json({ message: "Booking is not rejected" });
      }

      if (!booking.rejectedAt) {
        return res
          .status(400)
          .json({ message: "No rejectedAt date found for this booking" });
      }
      // Check if rejectedAt is within last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      if (new Date(booking.rejectedAt) < thirtyDaysAgo) {
        return res
          .status(400)
          .json({ message: "Reconsideration window expired (30 days limit)" });
      }

      if (!booking.jobId || booking.jobId.user.toString() !== currentUserId) {
        return res.status(403).json({
          message: "You are not authorized to reconsider this booking",
        });
      }

      booking.status = "pending";
      await booking.save();

      await Notification.findOneAndDelete({
        bookingId,
        senderId: currentUserId,
        content: "Reject your request",
      });
      return res
        .status(200)
        .json({ message: "Booking reconsidered successfully", booking });
    } catch (error) {
      console.error("Error reconsidering booking:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
