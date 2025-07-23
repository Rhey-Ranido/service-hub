import Provider from "../models/Provider.js";
import User from "../models/User.js";
import Service from "../models/Service.js";

// create a new provider profile
export const createProvider = async (req, res) => {
  try {
    const userId = req.user.id;

    // Prevent creating multiple providers for the same user
    const existingProvider = await Provider.findOne({ userId });
    if (existingProvider) {
      return res.status(400).json({ message: "You already have a provider profile." });
    }

    // Validate required fields
    const { name, location } = req.body;
    if (!name || !location?.address) {
      return res.status(400).json({ message: "Name and location address are required" });
    }

    // Update user role to provider
    await User.findByIdAndUpdate(userId, { role: 'provider' });

    const providerData = {
      userId,
      name,
      bio: req.body.bio || '',
      location: {
        address: location.address,
        type: "Point",
        coordinates: location.coordinates || [0, 0] // Default coordinates [longitude, latitude]
      },
      categories: req.body.categories || [],
      skills: req.body.skills || [],
      languages: req.body.languages || ['English'],
      socialLinks: req.body.socialLinks || {}
    };

    const newProvider = await Provider.create(providerData);
    const populatedProvider = await newProvider.populate('userId', 'email firstName lastName isVerified');

    res.status(201).json(populatedProvider);
  } catch (error) {
    console.error("Error creating provider:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// get all providers with filtering and search
export const getAllProviders = async (req, res) => {
  try {
    const {
      search,
      category,
      location,
      minRating,
      sortBy = 'rating.average',
      sortOrder = 'desc',
      page = 1,
      limit = 12,
      verified
    } = req.query;

    // Build filter object
    const filter = { status: 'approved' };

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
        { categories: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      filter.categories = { $in: [category] };
    }

    // Location filter
    if (location && location !== 'all') {
      filter['location.address'] = { $regex: location, $options: 'i' };
    }

    // Rating filter
    if (minRating) {
      filter['rating.average'] = { $gte: Number(minRating) };
    }

    // Verified filter
    if (verified === 'true') {
      filter.isVerified = true;
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    const providers = await Provider.find(filter)
      .populate('userId', 'email firstName lastName isVerified lastActive')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const totalProviders = await Provider.countDocuments(filter);

    // Format response
    const formattedProviders = providers.map(provider => ({
      id: provider._id,
      name: provider.name,
      bio: provider.bio,
      profileImage: provider.profileImage,
      location: provider.location.address,
      rating: provider.rating,
      totalReviews: provider.totalReviews,
      totalServices: provider.totalServices,
      isVerified: provider.isVerified,
      categories: provider.categories,
      skills: provider.skills,
      languages: provider.languages,
      responseTime: provider.responseTime,
      completedProjects: provider.completedProjects,
      socialLinks: provider.socialLinks,
      memberSince: provider.createdAt,
      lastActive: provider.userId.lastActive
    }));

    res.status(200).json({
      providers: formattedProviders,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalProviders / limit),
        totalProviders,
        hasNextPage: page * limit < totalProviders,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get provider by id with detailed information and services
export const getProviderById = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findById(id)
      .populate('userId', 'email firstName lastName isVerified lastActive');

    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    // Get provider's services
    const services = await Service.find({ providerId: id, isActive: true })
      .select('title shortDescription price category tags featured rating totalOrders images')
      .lean();

    // Format response
    const formattedProvider = {
      id: provider._id,
      name: provider.name,
      bio: provider.bio,
      profileImage: provider.profileImage,
      location: provider.location.address,
      rating: provider.rating,
      totalReviews: provider.totalReviews,
      totalServices: provider.totalServices,
      isVerified: provider.isVerified,
      status: provider.status,
      categories: provider.categories,
      skills: provider.skills,
      languages: provider.languages,
      responseTime: provider.responseTime,
      completedProjects: provider.completedProjects,
      socialLinks: provider.socialLinks,
      memberSince: provider.createdAt,
      lastActive: provider.userId.lastActive,
      user: {
        email: provider.userId.email,
        firstName: provider.userId.firstName,
        lastName: provider.userId.lastName,
        isVerified: provider.userId.isVerified
      },
      services: services.map(service => ({
        id: service._id,
        title: service.title,
        description: service.shortDescription,
        price: service.price.amount,
        priceUnit: service.price.unit,
        category: service.category,
        tags: service.tags,
        featured: service.featured,
        rating: service.rating,
        totalOrders: service.totalOrders,
        images: service.images
      }))
    };

    res.status(200).json(formattedProvider);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update
export const updateProvider = async (req, res) => {
  try {
    const userId = req.user.id; // extracted from JWT by auth middleware

    const updatedProvider = await Provider.findOneAndUpdate(
      { userId }, // match by authenticated user
      { $set: req.body }, // fields to update
      { new: true } // return updated document
    );

    if (!updatedProvider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    res.status(200).json(updatedProvider);
  } catch (error) {
    console.error("Error updating provider:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// delete provider
export const deleteProvider = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ error: "Provider not found" });

    if (
      provider.userId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await provider.deleteOne();
    res.json({ message: "Provider deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
