import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    unique:true,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  cloudinary_id: {
    image_id: {
      type: String,
      required: true,
    },
    video_id: {
      type: String,
      default: null,
    },
  },
});

const Blog = mongoose.model("blog", blogSchema);

export default Blog;
