// controllers/blogController.js

const Blog = require("../models/Blog");
const asyncHandler = require("../middleware/asyncHandler");
const { NotFoundError, UnauthorizedError } = require("../utils/customErrors");

// Create a new blog post
exports.createBlog = asyncHandler(async (req, res) => {
  const { title, content, imageUrl } = req.body;

  if (!title || !content || !imageUrl) {
    throw new BadRequestError("Title, content, and image URL are required");
  }

  const blog = new Blog({
    tutorId: req.user._id,
    title,
    content,
    imageUrl,
  });

  await blog.save();

  res.status(201).json({
    success: true,
    blog,
  });
});

// Get all blog posts by the authenticated tutor
exports.getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ tutorId: req.user._id }).lean();

  res.status(200).json({
    success: true,
    blogs,
  });
});

// Update a blog post by ID
exports.updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, imageUrl } = req.body;

  const blog = await Blog.findOne({ _id: id, tutorId: req.user._id });
  if (!blog) {
    throw new NotFoundError("Blog not found");
  }

  // Update only the provided fields
  if (title) blog.title = title;
  if (content) blog.content = content;
  if (imageUrl) blog.imageUrl = imageUrl;

  await blog.save();

  res.status(200).json({
    success: true,
    message: "Blog updated successfully",
    blog,
  });
});

// Delete a blog post by ID
exports.deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findOneAndDelete({ _id: id, tutorId: req.user._id });
  if (!blog) {
    throw new NotFoundError("Blog not found");
  }

  res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
  });
});
