import jwt from 'jsonwebtoken';
import 'dotenv/config'

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";// Ensure your JWT_SECRET is stored in the .env file

// Middleware to verify token and extract userId
export const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Authentication token is missing" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId; // Make sure you are setting req.userId
        next(); // Proceed to the next middleware
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

