import path from 'path'
import { fileURLToPath } from 'url';
const HOST =
process.env.NODE_ENV === "production"
  ? "https://api.famylink.us"
  : "http://localhost:3000";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const extractRootDirPath = (filePath) => {
    const pathArray = filePath.split("\\");
    const pathOfRootDir = pathArray.slice(0, pathArray.indexOf("src"));
    return pathOfRootDir.join("\\");
};

export const createPublicUrlByFilename = (req, filename) => {
    console.log(req,`${HOST}/assets/uploads/${req.user?.userId}/${req.baseUrl.split("/")[3]
        }/${filename}`  )
    return `${HOST}/assets/uploads/${req.user?.userId}/${req.baseUrl.split("/")[3]
        }/${filename}`;
};

export const createPublicUrlForFile = (req, file) => {
    return `${HOST}/${file.path
        .slice(file.path.indexOf("assets"))
        .replace(/\\/g, "/")}`;
};

export const createLocalUrlForFile = (imageUrl) => {
    const rootDir = path.join(__dirname, "..");
    return path.join(
        extractRootDirPath(rootDir),
        imageUrl.slice(imageUrl.indexOf("assets"))
    );
};


