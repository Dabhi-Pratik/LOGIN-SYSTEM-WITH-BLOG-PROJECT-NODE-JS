import multer from "multer";
import pkg from "multer-storage-cloudinary";
const { CloudinaryStorage } = pkg;
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.mimetype.startsWith("image")) {
      return {
        folder: "blog/images",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [
          { width: 1200, height: 800, crop: "limit" },
          { quality: "auto" },
        ],
      };
    } else if (file.mimetype.startsWith("video")) {
      return {
        folder: "blog/videos",
        resource_type: "video",
      };
    }
  },
});

const upload = multer({ storage });

export default upload;
