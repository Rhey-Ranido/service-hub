import mongoose from "mongoose";
import Service from "../models/Service.js";
import Provider from "../models/Provider.js";
import User from "../models/User.js";
import ServiceReview from "../models/ServiceReview.js";
import ProviderReview from "../models/ProviderReview.js";

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

// GET top 3 services by review rating
export const getTopRatedServices = async (req, res) => {
  try {
    // Get all services with their reviews
    const services = await Service.find({ isActive: true })
      .populate({
        path: 'providerId',
        select: 'name location.address rating isVerified userId status',
        match: { status: 'approved' },
        populate: {
          path: 'userId',
          select: 'profileImage firstName lastName',
          model: 'User'
        }
      })
      .lean();

    // Filter out services where provider didn't match or isn't approved
    const filteredServices = services.filter(service => service.providerId);

    // Calculate real rating for each service
    const servicesWithRatings = await Promise.all(filteredServices.map(async (service) => {
      const serviceReviews = await ServiceReview.find({ serviceId: service._id });
      const serviceRatingCount = serviceReviews.length;
      const serviceRatingAverage = serviceRatingCount > 0 
        ? serviceReviews.reduce((sum, review) => sum + review.rating, 0) / serviceRatingCount 
        : 0;

      const providerReviews = await ProviderReview.find({ providerId: service.providerId._id });
      const providerRatingCount = providerReviews.length;
      const providerRatingAverage = providerRatingCount > 0 
        ? providerReviews.reduce((sum, review) => sum + review.rating, 0) / providerRatingCount 
        : 0;

      const baseUrl = `${req.protocol}://${req.get('host')}/uploads`;
      const imageUrls = service.images?.map(img => `${baseUrl}/${img}`) || [];
      const userProfileImageUrl = service.providerId.userId?.profileImage 
        ? `${baseUrl}/${service.providerId.userId.profileImage}` 
        : null;

      return {
        id: service._id,
        title: service.title,
        description: service.shortDescription || service.description,
        price: service.price.amount,
        priceUnit: service.price.unit,
        tags: service.tags,
        category: service.category,
        rating: {
          average: serviceRatingAverage,
          count: serviceRatingCount
        },
        images: service.images,
        imageUrls: imageUrls,
        provider: {
          id: service.providerId.userId,
          providerId: service.providerId._id,
          name: service.providerId.name,
          location: service.providerId.location.address,
          rating: providerRatingAverage,
          reviewCount: providerRatingCount,
          isVerified: service.providerId.isVerified,
          profileImage: service.providerId.userId?.profileImage,
          profileImageUrl: userProfileImageUrl
        },
        createdAt: service.createdAt,
        ratingScore: serviceRatingAverage * Math.log10(serviceRatingCount + 1) // Weight by number of reviews
      };
    }));

    // Sort by rating score and get top 3
    const topServices = servicesWithRatings
      .sort((a, b) => b.ratingScore - a.ratingScore)
      .slice(0, 3);

    res.status(200).json(topServices);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

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
      featured,
      lat,
      lng,
      radius = 50 // Default radius in kilometers
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
    
    // Handle location-based sorting
    if (sortBy === 'distance' && lat && lng) {
      // We'll sort by distance after fetching the data
      sortObj['rating.average'] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build provider match conditions
    const providerMatch = { status: 'approved' };
    
    // Location-based filtering
    if (lat && lng && radius) {
      // Use geospatial query for nearby providers
      providerMatch.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: Number(radius) * 1000 // Convert km to meters
        }
      };
    } else if (location && location !== 'all') {
      // Text-based location filtering
      providerMatch['location.address'] = { $regex: location, $options: 'i' };
    }

    // Get services with populated provider data and user data
    const services = await Service.find(filter)
      .populate({
        path: 'providerId',
        select: 'name location.address location.coordinates rating isVerified userId status',
        match: providerMatch,
        populate: {
          path: 'userId',
          select: 'profileImage firstName lastName',
          model: 'User'
        }
      })
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Filter out services where provider didn't match location filter
    const filteredServices = services.filter(service => service.providerId);

    // Calculate distances and sort by distance if requested
    if (sortBy === 'distance' && lat && lng) {
      filteredServices.forEach(service => {
        if (service.providerId.location?.coordinates) {
          const [lng1, lat1] = service.providerId.location.coordinates;
          const distance = calculateDistance(
            Number(lat), Number(lng),
            lat1, lng1
          );
          service.distance = distance;
        }
      });

      // Sort by distance
      filteredServices.sort((a, b) => {
        if (sortOrder === 'asc') {
          return (a.distance || Infinity) - (b.distance || Infinity);
        } else {
          return (b.distance || Infinity) - (a.distance || Infinity);
        }
      });
    }

    // Get total count for pagination
    const totalServices = await Service.countDocuments(filter);
    
    // Calculate real statistics for each service
    const formattedServices = await Promise.all(filteredServices.map(async (service) => {
      // Calculate real service statistics from reviews
      const serviceReviews = await ServiceReview.find({ serviceId: service._id });
      const serviceRatingCount = serviceReviews.length;
      const serviceRatingAverage = serviceRatingCount > 0 
        ? serviceReviews.reduce((sum, review) => sum + review.rating, 0) / serviceRatingCount 
        : 0;

      // Calculate real provider statistics from reviews
      const providerReviews = await ProviderReview.find({ providerId: service.providerId._id });
      const providerRatingCount = providerReviews.length;
      const providerRatingAverage = providerRatingCount > 0 
        ? providerReviews.reduce((sum, review) => sum + review.rating, 0) / providerRatingCount 
        : 0;

      const baseUrl = `${req.protocol}://${req.get('host')}/uploads`;
      const imageUrls = service.images?.map(img => `${baseUrl}/${img}`) || [];
      const userProfileImageUrl = service.providerId.userId?.profileImage 
        ? `${baseUrl}/${service.providerId.userId.profileImage}` 
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
        rating: {
          average: serviceRatingAverage,
          count: serviceRatingCount
        },
        totalOrders: service.totalOrders,
        images: service.images,
        imageUrls: imageUrls,
        distance: service.distance,
        provider: {
          id: service.providerId.userId, // Use the User ID, not the Provider ID
          providerId: service.providerId._id, // Keep the Provider ID for reference
          name: service.providerId.name,
          location: service.providerId.location.address,
          coordinates: service.providerId.location.coordinates,
          rating: providerRatingAverage,
          reviewCount: providerRatingCount,
          isVerified: service.providerId.isVerified,
          profileImage: service.providerId.userId?.profileImage,
          profileImageUrl: userProfileImageUrl
        },
        createdAt: service.createdAt
      };
    }));

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

    // Check if provider is approved
    const provider = await Provider.findById(providerId);
    if (!provider || provider.status !== 'approved') {
      return res.status(404).json({ message: "Provider not found" });
    }

    const services = await Service.find({ providerId })
      .populate({
        path: 'providerId',
        select: 'name location rating isVerified userId',
        populate: {
          path: 'userId',
          select: 'profileImage firstName lastName',
          model: 'User'
        }
      })
      .lean();

    // Format services to include provider profile image
    const formattedServices = services.map(service => {
      const baseUrl = `${req.protocol}://${req.get('host')}/uploads`;
      const imageUrls = service.images?.map(img => `${baseUrl}/${img}`) || [];
      const userProfileImageUrl = service.providerId.userId?.profileImage 
        ? `${baseUrl}/${service.providerId.userId.profileImage}` 
        : null;

      return {
        ...service,
        imageUrls,
        provider: {
          id: service.providerId._id,
          name: service.providerId.name,
          location: service.providerId.location,
          rating: service.providerId.rating,
          isVerified: service.providerId.isVerified,
          profileImage: service.providerId.userId?.profileImage,
          profileImageUrl: userProfileImageUrl
        }
      };
    });

    res.status(200).json(formattedServices);
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
        select: 'name location.address rating isVerified userId',
        populate: {
          path: 'userId',
          select: 'profileImage firstName lastName',
          model: 'User'
        }
      })
      .sort({ createdAt: -1 })
      .lean();

    // Format services for frontend
    const formattedServices = services.map(service => {
      const baseUrl = `${req.protocol}://${req.get('host')}/uploads`;
      const imageUrls = service.images?.map(img => `${baseUrl}/${img}`) || [];
      const userProfileImageUrl = service.providerId.userId?.profileImage 
        ? `${baseUrl}/${service.providerId.userId.profileImage}` 
        : null;

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
        updatedAt: service.updatedAt,
        provider: {
          id: service.providerId.userId,
          name: service.providerId.name,
          location: service.providerId.location.address,
          rating: service.providerId.rating,
          isVerified: service.providerId.isVerified,
          profileImage: service.providerId.userId?.profileImage,
          profileImageUrl: userProfileImageUrl
        }
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
        select: 'name bio location rating totalReviews totalServices isVerified responseTime completedProjects categories skills languages socialLinks createdAt userId status',
        populate: {
          path: 'userId',
          select: 'profileImage firstName lastName',
          model: 'User'
        }
      });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Check if provider is approved
    if (!service.providerId || service.providerId.status !== 'approved') {
      return res.status(404).json({ message: "Service not found" });
    }

    // Increment view count
    await Service.findByIdAndUpdate(id, { $inc: { views: 1 } });

    // Calculate real service statistics from reviews
    const serviceReviews = await ServiceReview.find({ serviceId: service._id });
    const serviceRatingCount = serviceReviews.length;
    const serviceRatingAverage = serviceRatingCount > 0 
      ? serviceReviews.reduce((sum, review) => sum + review.rating, 0) / serviceRatingCount 
      : 0;



    // Calculate real provider statistics from reviews
    const providerReviews = await ProviderReview.find({ providerId: service.providerId._id });
    const providerRatingCount = providerReviews.length;
    const providerRatingAverage = providerRatingCount > 0 
      ? providerReviews.reduce((sum, review) => sum + review.rating, 0) / providerRatingCount 
      : 0;



    // Count provider's total services
    const providerServicesCount = await Service.countDocuments({ 
      providerId: service.providerId._id,
      isActive: true 
    });

    // Generate image URLs
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads`;
    const imageUrls = service.images?.map(img => `${baseUrl}/${img}`) || [];
    const userProfileImageUrl = service.providerId.userId?.profileImage 
      ? `${baseUrl}/${service.providerId.userId.profileImage}` 
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
      rating: {
        average: serviceRatingAverage,
        count: serviceRatingCount
      },
      totalOrders: service.totalOrders,
      views: service.views + 1,
      provider: {
        id: service.providerId.userId, // Use the User ID, not the Provider ID
        providerId: service.providerId._id, // Keep the Provider ID for reference
        name: service.providerId.name,
        bio: service.providerId.bio,
        profileImage: service.providerId.userId?.profileImage,
        profileImageUrl: userProfileImageUrl,
        location: service.providerId.location.address,
        coordinates: service.providerId.location?.coordinates,
        rating: {
          average: providerRatingAverage,
          count: providerRatingCount
        },
        totalReviews: providerRatingCount,
        totalServices: providerServicesCount,
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
    // Check if user account is active
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const accountStatus = user.status || 'active';
    if (accountStatus !== 'active') {
      return res.status(403).json({ message: `Your account is ${accountStatus}. You cannot create services.` });
    }

    // Verify user is a provider and is approved
    const provider = await Provider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(403).json({ message: "You must be a registered provider to create services" });
    }
    
    if (provider.status !== 'approved') {
      return res.status(403).json({ message: "Your provider account must be approved before you can create services" });
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

    // Update provider's total services count using the static method
    await Provider.updateTotalServices(provider._id);

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

    // Check if user account is active (unless admin)
    if (req.user.role !== "admin") {
      const user = await User.findById(req.user.id);
      if (!user || user.status !== 'active') {
        return res.status(403).json({ message: `Your account is ${user?.status || 'inactive'}. You cannot update services.` });
      }
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

    // Check if user account is active (unless admin)
    if (req.user.role !== "admin") {
      const user = await User.findById(req.user.id);
      if (!user || user.status !== 'active') {
        return res.status(403).json({ message: `Your account is ${user?.status || 'inactive'}. You cannot delete services.` });
      }
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

    const providerId = service.providerId;
    await service.deleteOne();

    // Update provider's total services count after deletion
    await Provider.updateTotalServices(providerId);

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
