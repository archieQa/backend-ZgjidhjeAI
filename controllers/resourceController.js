// controllers/resourceController.js

const Resource = require("../models/Resource");
const asyncHandler = require("../middleware/asyncHandler");
const { BadRequestError, NotFoundError } = require("../utils/customErrors");

// Create a new resource
exports.createResource = asyncHandler(async (req, res) => {
  const { title, description, imageUrl } = req.body;

  if (!title || !description || !imageUrl) {
    throw new BadRequestError("Title, description, and image URL are required");
  }

  const resource = new Resource({
    tutorId: req.user._id, // Assuming req.user contains the authenticated tutor's ID
    title,
    description,
    imageUrl,
  });

  await resource.save();

  res.status(201).json({
    success: true,
    resource,
  });
});

// Get all resources for the authenticated tutor
exports.getResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find({ tutorId: req.user._id }).lean();

  res.status(200).json({
    success: true,
    resources,
  });
});

// Update a resource by ID
exports.updateResource = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, imageUrl } = req.body;

  const resource = await Resource.findOne({ _id: id, tutorId: req.user._id });
  if (!resource) {
    throw new NotFoundError("Resource not found");
  }

  // Update fields only if provided
  if (title) resource.title = title;
  if (description) resource.description = description;
  if (imageUrl) resource.imageUrl = imageUrl;

  await resource.save();

  res.status(200).json({
    success: true,
    message: "Resource updated successfully",
    resource,
  });
});

// Delete a resource by ID
exports.deleteResource = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const resource = await Resource.findOneAndDelete({
    _id: id,
    tutorId: req.user._id,
  });
  if (!resource) {
    throw new NotFoundError("Resource not found");
  }

  res.status(200).json({
    success: true,
    message: "Resource deleted successfully",
  });
});
