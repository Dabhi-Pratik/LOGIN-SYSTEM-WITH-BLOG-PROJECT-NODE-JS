import HttpError from "../middleware/HttpError.js";
import cloudinary from "../config/cloudinary.js";
import Blog from "../model/blogModel.js";

const createBlog = async (req, res, next) => {
  try {
    const image = req.files["image"]?.[0];
    const video = req.files["video"]?.[0];

    const newBlog = new Blog({
      title: req.body.title,
      description: req.body.description,
      image: image?.path,
      video: video?.path || null,
      cloudinary_id: {
        image_id: image?.filename,
        video_id: video?.filename || null,
      },
    });

    await newBlog.save();

    res.status(201).json({
      message: "Blog Created Successfully",
      data: newBlog,
    });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

const getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find();

    res.status(200).json({ success: true, blogs });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

const getById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const blog = await Blog.findById(id);

    if (!blog) {
      return next(new HttpError("Blog not Found..!", 404));
    }

    res.status(200).json({ success: true, blog });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    const image = req.files["image"]?.[0];
    const video = req.files["video"]?.[0];

    blog.title = req.body.title || blog.title;
    blog.description = req.body.description || blog.description;

    if (image) {
      await cloudinary.uploader.destroy(blog.cloudinary_id.image_id);

      blog.image = image.path;
      blog.cloudinary_id.image_id = image.filename;
    }

    if (video) {
      if (blog.cloudinary_id.video_id) {
        await cloudinary.uploader.destroy(blog.cloudinary_id.video_id, {
          resource_type: "video",
        });
      }

      blog.video = video.path;
      blog.cloudinary_id.video_id = video.filename;
    }

    await blog.save();

    res.json({ message: "Blog Updated Successfully..!", blog });
  } catch (error) {
    next(new HttpError(error.message)); 
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const id = req.params.id;

    const blog = await Blog.findById(id);

    if (!blog) {
      return next(new HttpError("Blog not found", 404));
    }

    if (blog.cloudinary_id?.image_id) {
      await cloudinary.uploader.destroy(blog.cloudinary_id.image_id);
    }

    if (blog.cloudinary_id?.video_id) {
      await cloudinary.uploader.destroy(blog.cloudinary_id.video_id, {
        resource_type: "video",
      });
    }

    await blog.deleteOne();
    res.status(200).json({ message: "Blog Deleted SuccessFully....", blog });
  } catch (error) {
    next(new HttpError(error.message));
  }
};
export default { createBlog, getBlogs, getById, updateBlog, deleteBlog };
