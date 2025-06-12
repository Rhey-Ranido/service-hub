import mongoose from "mongoose";
import Service from "../models/Service.js";

// GET all services (public)
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate("providerId", "-__v").lean();

    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET all services by provider ID
export const getAllServicesByProviderId = async (req, res) => {
  try {
    const { providerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(providerId)) {
      return res.status(400).json({ message: "Invalid provider ID" });
    }

    const services = await Service.find({ providerId })
      .populate("providerId", "-__v")
      .lean();

    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET a specific service by ID
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }

    const service = await Service.findById(id).populate("providerId");

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// CREATE a new service (provider only)
export const createService = async (req, res) => {
  try {
    const newService = await Service.create({
      ...req.body,
      providerId: req.user.id, // Ensure `req.user` is set by auth middleware
    });

    const populatedService = await newService.populate("providerId", "-__v");

    res.status(201).json(populatedService);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create service", error: err.message });
  }
};

// UPDATE a service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }

    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    if (
      service.providerId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Service.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update service", error: err.message });
  }
};

// DELETE a service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (
      service.providerId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this service" });
    }

    await service.deleteOne();

    res.status(200).json({
      message: "Service deleted successfully",
      serviceId: id,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete service", error: err.message });
  }
};
