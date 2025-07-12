import fs from 'fs'
import multer from 'multer';
import path from 'path';
import { extractRootDirPath } from './upload.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.memoryStorage({
    destination: (req, file, cb) => {
        // console.log(req)
        if (!req || !req.userId) {
            return cb(new Error('User not authenticated or userId missing'));
        }
        const rootDir = path.join(__dirname, "..");

        const uploadDir = path.join(
            extractRootDirPath(rootDir),
            "assets",
            "uploads",
            req.userId,
            req.baseUrl.split("/").pop() || "default"
        );

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

export const upload = multer({ storage });