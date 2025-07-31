import express from "express";
import User from "../Schema/user.js";
import bcrypt from "bcryptjs";
import { authMiddleware } from "../Services/utils/middlewareAuth.js";
import { generateTokens } from "./Auth.js";

const router = express.Router();
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10");

router.put('/email', authMiddleware, async (req, res) => {
    const id = req.userId;
    const { currentEmail, newEmail } = req.body;

    try {
        const user = await User.findById(id);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found."
            });
        }

        // Validate input
        if (!currentEmail || !newEmail) {
            return res.status(400).json({
                status: 400,
                message: "Current email and new email are required."
            });
        }

        // Check if the current email matches the user's email in the database
        if (user.email !== currentEmail) {
            return res.status(400).json({
                status: 400,
                message: "The current email does not match the user's email."
            });
        }

        // Check if the new email is different from the current email
        if (currentEmail === newEmail) {
            return res.status(400).json({
                status: 400,
                message: "New email must be different from the current email."
            });
        }

        // Check if the new email already exists in the database
        const emailExists = await User.findOne({ email: newEmail });
        if (emailExists) {
            return res.status(400).json({
                status: 400,
                message: "New email is already in use."
            });
        }

        // Update user's email and set emailVer to false
        user.email = newEmail;
        user.verified.emailVer = false;
        await user.save();

        return res.status(200).json({
            status: 200,
            message: "Email changed successfully, verification status reset."
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Server error",
            error: error.message
        });
    }
});

router.put('/password', authMiddleware, async (req, res) => {
    const id = req.userId;
    const { currentPassword, newPassword } = req.body;

    try {
        // Find the user by ID
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found."
            });
        }

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                status: 400,
                message: "Current password and new password are required."
            });
        }

        // Verify that currentPassword matches the stored password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                status: 400,
                message: "Current password is incorrect."
            });
        }

        // Ensure newPassword is different from the current password
        if (currentPassword === newPassword) {
            return res.status(400).json({
                status: 400,
                message: "New password must be different from the current password."
            });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

        // Update the user's password
        user.password = hashedNewPassword;
        await user.save();

        return res.status(200).json({
            status: 200,
            message: "Password updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
});

router.put('/text-notifications', authMiddleware, async (req, res) => {
    const id = req.userId;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { sms } = req.body;
        if (typeof sms !== 'boolean') {
            return res.status(400).json({ message: "Invalid sms value" });
        }

        user.notifications.sms = sms;
        await user.save();

        return res.status(200).json({
            message: "Text notification preference updated successfully",
            sms: user.notifications.sms,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.put('/phone', authMiddleware, async (req, res) => {
    const id = req.userId;

    try {
        // Find user by ID
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Extract phoneNo from request body
        const { phoneNo } = req.body;

        if (!phoneNo) {
            return res.status(400).json({ message: "Phone number is required" });
        }

        // Update the phone number
        user.phoneNo = phoneNo;
        user.verified.phoneVer = false;
        user.notifications.sms = false;
        console.log("Updated User:", user);

        await user.save()
            .then(() => console.log('User updated successfully'))
            .catch(err => console.error('Error saving user:', err)); // Save the updated user document

        // Generate tokens
        const { accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry } =
            await generateTokens(user._id.toString());

        const {
            password: _password,
            online,
            ActiveAt,
            otp,
            otpExpiry,
            ...userDetails
        } = user.toObject();

        // Return successful response
        return res.status(200).json({
            message: "Phone number updated successfully",
            user: userDetails,
            accessToken,
            refreshToken,
            accessTokenExpiry,
            refreshTokenExpiry,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.put('/email-notifications', authMiddleware, async (req, res) => {
    const id = req.userId;
    const { notifications } = req.body; // notifications should be an object with the notification options to update

    try {
        const user = await User.findById(id);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the email is verified
        if (!user.verified.emailVer) {
            return res.status(403).json({ message: "Email not verified" });
        }

        // Update email notifications
        const emailNotifications = user.notifications.email;

        Object.keys(emailNotifications).forEach((key) => {
            emailNotifications[key] = false;
        });

        // Enable only the specified notifications
        notifications.forEach((key) => {
            if (emailNotifications.hasOwnProperty(key)) {
                emailNotifications[key] = true;
            }
        });

        // Save the updated user document
        await user.save();

        return res.status(200).json({ message: "Email notifications updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;
