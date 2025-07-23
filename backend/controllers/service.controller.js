import mongoose from "mongoose";
import Service from "../models/Service.js";
import Provider from "../models/Provider.js";

// GET all services with advanced filtering and search
export const getAllServices = async (req, res) => {
  try {
    const {
      search,
      category,
      location,
      minPrice,
      maxPrice,
      sortBy = 'rating.average',
      sortOrder = 'desc',
      page = 1,
      limit = 12,
      featured
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Featured filter
    if (featured === 'true') {
      filter.featured = true;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter['price.amount'] = {};
      if (minPrice) filter['price.amount'].$gte = Number(minPrice);
      if (maxPrice) filter['price.amount'].$lte = Number(maxPrice);
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get services with populated provider data
    const services = await Service.find(filter)
      .populate({
        path: 'providerId',
        select: 'name location.address rating isVerified userId',
        match: location && location !== 'all' ? { 'location.address': { $regex: location, $options: 'i' } } : {}
      })
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Filter out services where provider didn't match location filter
    const filteredServices = services.filter(service => service.providerId);

    // Get total count for pagination
    const totalServices = await Service.countDocuments(filter);
    
    // Format response to match frontend expectations
    const formattedServices = filteredServices.map(service => {
      const baseUrl = `${req.protocol}://${req.get('host')}/uploads`;
      const imageUrls = service.images?.map(img => `${baseUrl}/${img}`) || [];
      const providerProfileImageUrl = service.providerId.profileImage 
        ? `${baseUrl}/${service.providerId.profileImage}` 
        : null;

      return {
        id: service._id,
        title: service.title,
        description: service.shortDescription || service.description,
        price: service.price.amount,
        priceUnit: service.price.unit,
        tags: service.tags,
        category: service.category,
        featured: service.featured,
        rating: service.rating,
        totalOrders: service.totalOrders,
        images: service.images,
        imageUrls: imageUrls,
        provider: {
          id: service.providerId.userId, // Use the User ID, not the Provider ID
          providerId: service.providerId._id, // Keep the Provider ID for reference
          name: service.providerId.name,
          location: service.providerId.location.address,
          rating: service.providerId.rating.average,
          reviewCount: service.providerId.rating.count,
          isVerified: service.providerId.isVerified,
          profileImage: service.providerId.profileImage,
          profileImageUrl: providerProfileImageUrl
        },
        createdAt: service.createdAt
      };
    });

    res.status(200).json({
      services: formattedServices,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalServices / limit),
        totalServices,
        hasNextPage: page * limit < totalServices,
        hasPrevPage: page > 1
      }
    });
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
      .populate("providerId", "-__v userId")
      .lean();

    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET all services for the authenticated provider
export const getMyServices = async (req, res) => {
  try {
    // Find provider by authenticated user ID
    const provider = await Provider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    // Get services for this provider
    const services = await Service.find({ providerId: provider._id })
      .populate({
        path: 'providerId',
        select: 'name location.address rating isVerified userId'
      })
      .sort({ createdAt: -1 })
      .lean();

    // Format services for frontend
    const formattedServices = services.map(service => {
      const baseUrl = `${req.protocol}://${req.get('host')}/uploads`;
      const imageUrls = service.images?.map(img => `${baseUrl}/${img}`) || [];

      return {
        id: service._id,
        title: service.title,
        description: service.description,
        shortDescription: service.shortDescription,
        price: service.price,
        category: service.category,
        tags: service.tags,
        images: service.images,
        imageUrls: imageUrls,
        featured: service.featured,
        isActive: service.isActive,
        deliveryTime: service.deliveryTime,
        revisions: service.revisions,
        requirements: service.requirements,
        faqs: service.faqs,
        packages: service.packages,
        rating: service.rating,
        totalOrders: service.totalOrders,
        views: service.views,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
      };
    });

    res.status(200).json({
      services: formattedServices,
      total: formattedServices.length
    });

  } catch (err) {
    console.error('Error fetching provider services:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET a specific service by ID with detailed information
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }

    const service = await Service.findById(id)
      .populate({
        path: 'providerId',
        select: 'name bio profileImage location rating totalReviews totalServices isVerified responseTime completedProjects categories skills languages socialLinks createdAt userId'
      });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Increment view count
    await Service.findByIdAndUpdate(id, { $inc: { views: 1 } });

    // Generate image URLs
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads`;
    const imageUrls = service.images?.map(img => `${baseUrl}/${img}`) || [];
    const providerProfileImageUrl = service.providerId.profileImage 
      ? `${baseUrl}/${service.providerId.profileImage}` 
      : null;

    // Format response
    const formattedService = {
      id: service._id,
      title: service.title,
      description: service.description,
      shortDescription: service.shortDescription,
      price: service.price,
      category: service.category,
      tags: service.tags,
      images: service.images,
      imageUrls: imageUrls,
      featured: service.featured,
      deliveryTime: service.deliveryTime,
      revisions: service.revisions,
      requirements: service.requirements,
      faqs: service.faqs,
      packages: service.packages,
      rating: service.rating,
      totalOrders: service.totalOrders,
      views: service.views + 1,
      provider: {
        id: service.providerId.userId, // Use the User ID, not the Provider ID
        providerId: service.providerId._id, // Keep the Provider ID for reference
        name: service.providerId.name,
        bio: service.providerId.bio,
        profileImage: service.providerId.profileImage,
        profileImageUrl: providerProfileImageUrl,
        location: service.providerId.location.address,
        rating: service.providerId.rating,
        totalReviews: service.providerId.totalReviews,
        totalServices: service.providerId.totalServices,
        isVerified: service.providerId.isVerified,
        responseTime: service.providerId.responseTime,
        completedProjects: service.providerId.completedProjects,
        categories: service.providerId.categories,
        skills: service.providerId.skills,
        languages: service.providerId.languages,
        socialLinks: service.providerId.socialLinks,
        memberSince: service.providerId.createdAt
      },
      createdAt: service.createdAt,
      updatedAt: service.updatedAt
    };

    console.log('Service provider data:', {
      providerId: service.providerId._id,
      userId: service.providerId.userId,
      name: service.providerId.name
    });

    // Check if userId is available
    if (!service.providerId.userId) {
      console.error('Provider userId is missing!');
      return res.status(500).json({ message: "Provider user ID is missing" });
    }

    res.status(200).json(formattedService);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// CREATE a new service (provider only)
export const createService = async (req, res) => {
  try {
    // Verify user is a provider
    const provider = await Provider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(403).json({ message: "You must be a registered provider to create services" });
    }

    // Validate required fields
    const { title, description, price, category } = req.body;
    if (!title || !description || !price || !category) {
      return res.status(400).json({ 
        message: "Title, description, price, and category are required" 
      });
    }

    // Create service with provider ID
    const serviceData = {
      ...req.body,
      providerId: provider._id,
      price: {
        amount: typeof price === 'object' ? price.amount : price,
        unit: typeof price === 'object' ? price.unit : 'hour'
      }
    };

    const newService = await Service.create(serviceData);

    // Update provider's total services count
    await Provider.findByIdAndUpdate(provider._id, { 
      $inc: { totalServices: 1 } 
    });

    const populatedService = await newService.populate({
      path: 'providerId',
      select: 'name location.address rating isVerified'
    });

    res.status(201).json(populatedService);
  } catch (err) {
    res.status(500).json({ message: "Failed to create service", error: err.message });
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
