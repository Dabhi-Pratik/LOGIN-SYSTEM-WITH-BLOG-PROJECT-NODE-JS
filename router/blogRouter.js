import blogController from "../controller/blogController.js";
import express from "express";
import upload from "../middleware/upload.js";
import Blog from "../model/blogModel.js";

const router = express.Router();

router.post(
  "/create",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  blogController.createBlog,
);

router.get("/all", blogController.getBlogs);
router.get("/getById/:id", blogController.getById);
router.patch(
  "/update/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  blogController.updateBlog,
);

router.delete("/delete/:id", blogController.deleteBlog);

export default router;
