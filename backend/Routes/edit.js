import express from "express";
import User from "../Schema/user.js";
import { authMiddleware } from "../Services/utils/middlewareAuth.js";
import { upload } from "../Services/utils/uploadMiddleware.js";
import {
  createLocalUrlForFile,
  createPublicUrlForFile,
} from "../Services/utils/upload.js";
import fs from "fs";
import uploadImage from "../Services/utils/uplaodImage.js";

const router = express.Router();

router.put("/user", authMiddleware, upload.any(), async (req, res) => {
  const id = req.userId;
  const {
    name,
    location,
    gender,
    age,
    additionalInfo,
    services,
    noOfChildren,
    aboutMe,
    zipCode,
  } = req.body;

  let parsedAdditionalInfo = [];

  // Parse additionalInfo if it's provided as a string
  if (typeof additionalInfo === "string") {
    try {
      parsedAdditionalInfo = JSON.parse(additionalInfo);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Invalid JSON format for additionalInfo", error });
    }
  }

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle image upload
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imgUrl = await uploadImage(file.buffer, user.email, `${user._id}`);
        // const filePath = createPublicUrlForFile(req, file); // Generate public URL for the file
        // const localFilePath = createLocalUrlForFile(filePath); // Generate the local file system path for comparison

        // if (file.fieldname === "imageUrl") {
        //   // Check if the user already has an image and delete the old one if necessary
        //   if (user.imageUrl) {
        //     const existingImagePath = createLocalUrlForFile(user.imageUrl); // Convert user image URL to local file path

        //     // If the image exists in the local file system and it's not the same as the newly uploaded image
        //     if (
        //       fs.existsSync(existingImagePath) &&
        //       existingImagePath !== localFilePath
        //     ) {
        //       // Delete the old image
        //       fs.unlinkSync(existingImagePath);
        //     }
        //   }

        // Now assign the new image URL to the user object
        user.imageUrl = imgUrl; // Update the user with the new file URL
        // Add more conditions for other file fields if needed
      }
    }

    // Update basic fields
    if (name !== undefined) user.name = name;
    if (location !== undefined) user.location = JSON.parse(location);
    if (gender !== undefined) user.gender = gender;
    if (age !== undefined) user.age = age;
    if (zipCode !== undefined) user.zipCode = zipCode;
    if (aboutMe !== undefined) user.aboutMe = aboutMe;
    if (services && services != []) user.services = JSON.parse(services);
    if (noOfChildren) user.noOfChildren = JSON.parse(noOfChildren);

    // Initialize additionalInfo if it doesn't exist
    if (!Array.isArray(user.additionalInfo)) {
      user.additionalInfo = [];
    }
    
    // Update or add new additionalInfo entries
    if (Array.isArray(parsedAdditionalInfo)) {
      for (const newInfo of parsedAdditionalInfo) {
        const existingInfoIndex = user.additionalInfo.findIndex(
          (info) => info.key === newInfo.key
        );

        if (existingInfoIndex >= 0) {
          user.additionalInfo[existingInfoIndex].value = newInfo.value;
          user.markModified(`additionalInfo.${existingInfoIndex}.value`);
        } else {
          // Add new entry
          user.additionalInfo.push(newInfo);
        }
      }
    }

    // Save the updated user data
    await user.save();
    const populatedUser = await User.findById(id)
      .select("-password") // 👈 Exclude password from the main user
      .populate({
        path: "reviews.userId",
        select: "name imageUrl", // 👈 Ensure password is excluded from populated users too
      });

    // Calculate average rating
    let averageRating = 0;
    if (populatedUser.reviews && populatedUser.reviews.length > 0) {
      const totalRating = populatedUser.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      averageRating = (totalRating / populatedUser.reviews.length).toFixed(1);
    }
    // Return the updated user and average rating
    return res.status(200).json({
      message: "User updated successfully",
      user: { ...populatedUser.toObject(), averageRating }
    });
  } catch (error) {
    console.error("Error updating user:", error); // Log the error for debugging
    return res.status(500).json({ message: "Error updating user", error });
  }
});

export default router;
