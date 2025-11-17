import Provider from "../models/Provider.js";
import User from "../models/User.js";
import Service from "../models/Service.js";

// Get all providers for admin review
export const getAllProvidersForAdmin = async (req, res) => {
  try {
    const {
      status,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    const providers = await Provider.find(filter)
      .populate('userId', 'email firstName lastName isVerified createdAt lastActive profileImage')
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
      profileImage: provider.userId.profileImage,
      profileImageUrl: provider.userId.profileImage ? `${req.protocol}://${req.get('host')}/uploads/${provider.userId.profileImage}` : null,
      location: provider.location.address,
      status: provider.status,
      categories: provider.categories,
      skills: provider.skills,
      languages: provider.languages,
      socialLinks: provider.socialLinks,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
      user: {
        id: provider.userId._id,
        email: provider.userId.email,
        firstName: provider.userId.firstName,
        lastName: provider.userId.lastName,
        isVerified: provider.userId.isVerified,
        createdAt: provider.userId.createdAt
      }
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
  } catch (error) {
    console.error("Error getting providers for admin:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get provider details for admin review
export const getProviderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findById(id)
      .populate('userId', 'email firstName lastName isVerified createdAt lastActive profileImage');

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Get provider's services
    const services = await Service.find({ providerId: id })
      .select('title description price category isActive createdAt')
      .lean();

    // Get status counts for dashboard
    const statusCounts = await Provider.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusStats = statusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.status(200).json({
      provider: {
        id: provider._id,
        name: provider.name,
        bio: provider.bio,
        profileImage: provider.userId.profileImage,
        profileImageUrl: provider.userId.profileImage ? `${req.protocol}://${req.get('host')}/uploads/${provider.userId.profileImage}` : null,
        location: provider.location,
        status: provider.status,
        rejectionReason: provider.rejectionReason,
        adminFeedback: provider.adminFeedback,
        statusUpdatedAt: provider.statusUpdatedAt,
        categories: provider.categories,
        skills: provider.skills,
        languages: provider.languages,
        socialLinks: provider.socialLinks,
        rating: provider.rating,
        totalReviews: provider.totalReviews,
        totalServices: provider.totalServices,
        isVerified: provider.isVerified,
        responseTime: provider.responseTime,
        completedProjects: provider.completedProjects,
        createdAt: provider.createdAt,
        updatedAt: provider.updatedAt,
        user: {
          id: provider.userId._id,
          email: provider.userId.email,
          firstName: provider.userId.firstName,
          lastName: provider.userId.lastName,
          isVerified: provider.userId.isVerified,
          createdAt: provider.userId.createdAt,
          lastActive: provider.userId.lastActive,
          profileImage: provider.userId.profileImage,
          profileImageUrl: provider.userId.profileImage ? `${req.protocol}://${req.get('host')}/uploads/${provider.userId.profileImage}` : null
        }
      },
      services,
      statusStats
    });
  } catch (error) {
    console.error("Error getting provider details for admin:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Approve or reject provider
export const updateProviderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason, feedback } = req.body;

    if (!['approved', 'rejected', 'suspended'].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be 'approved', 'rejected', or 'suspended'" });
    }

    const provider = await Provider.findById(id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Update provider status and feedback
    provider.status = status;
    if (reason) {
      provider.rejectionReason = reason;
    }
    if (feedback) {
      provider.adminFeedback = feedback;
    }
    provider.statusUpdatedAt = new Date();
    await provider.save();

    // If approved, also verify the user
    if (status === 'approved') {
      await User.findByIdAndUpdate(provider.userId, { isVerified: true });
    }

    // Populate user data for response
    const updatedProvider = await provider.populate('userId', 'email firstName lastName isVerified profileImage');

    res.status(200).json({
      message: `Provider ${status} successfully`,
      provider: {
        id: updatedProvider._id,
        name: updatedProvider.name,
        status: updatedProvider.status,
        adminFeedback: updatedProvider.adminFeedback,
        statusUpdatedAt: updatedProvider.statusUpdatedAt,
        user: {
          id: updatedProvider.userId._id,
          email: updatedProvider.userId.email,
          firstName: updatedProvider.userId.firstName,
          lastName: updatedProvider.userId.lastName,
          isVerified: updatedProvider.userId.isVerified
        }
      }
    });
  } catch (error) {
    console.error("Error updating provider status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get admin dashboard statistics
export const getAdminDashboardStats = async (req, res) => {
  try {
    // Get provider status counts
    const providerStats = await Provider.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get total counts
    const totalProviders = await Provider.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalServices = await Service.countDocuments();

    // Get recent activity
    const recentProviders = await Provider.find()
      .populate('userId', 'email firstName lastName profileImage')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Get pending providers count
    const pendingProviders = await Provider.countDocuments({ status: 'pending' });

    const stats = {
      providers: {
        total: totalProviders,
        pending: pendingProviders,
        approved: providerStats.find(s => s._id === 'approved')?.count || 0,
        rejected: providerStats.find(s => s._id === 'rejected')?.count || 0,
        suspended: providerStats.find(s => s._id === 'suspended')?.count || 0
      },
      users: {
        total: totalUsers,
        clients: await User.countDocuments({ role: 'client' }),
        providers: await User.countDocuments({ role: 'provider' }),
        admins: await User.countDocuments({ role: 'admin' })
      },
      services: {
        total: totalServices,
        active: await Service.countDocuments({ isActive: true })
      },
      recentProviders: recentProviders.map(p => ({
        id: p._id,
        name: p.name,
        status: p.status,
        createdAt: p.createdAt,
        profileImage: p.userId.profileImage,
        profileImageUrl: p.userId.profileImage ? `${req.protocol}://${req.get('host')}/uploads/${p.userId.profileImage}` : null,
        user: {
          email: p.userId.email,
          firstName: p.userId.firstName,
          lastName: p.userId.lastName
        }
      }))
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error getting admin dashboard stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete provider (admin only)
export const deleteProviderByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findById(id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Delete all services associated with this provider
    await Service.deleteMany({ providerId: id });

    // Update user role back to client
    await User.findByIdAndUpdate(provider.userId, { role: 'client' });

    // Delete the provider
    await provider.deleteOne();

    res.status(200).json({ message: "Provider and associated services deleted successfully" });
  } catch (error) {
    console.error("Error deleting provider:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all users for admin management
export const getAllUsersForAdmin = async (req, res) => {
  try {
    const {
      status,
      role,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }

    if (role && role !== 'all') {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select('-password')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const totalUsers = await User.countDocuments(filter);

    // Check if users are providers
    const userIds = users.map(u => u._id);
    const providers = await Provider.find({ userId: { $in: userIds } })
      .select('userId status _id')
      .lean();

    const providerStatusMap = new Map(providers.map(p => [p.userId.toString(), p.status]));
    const providerIdMap = new Map(providers.map(p => [p.userId.toString(), p._id.toString()]));

    // Format response
    const formattedUsers = users.map(user => ({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status || 'active',
      isVerified: user.isVerified,
      profileImage: user.profileImage,
      profileImageUrl: user.profileImage ? `${req.protocol}://${req.get('host')}/uploads/${user.profileImage}` : null,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastActive: user.lastActive,
      statusUpdatedAt: user.statusUpdatedAt,
      providerStatus: providerStatusMap.get(user._id.toString()) || null,
      providerId: providerIdMap.get(user._id.toString()) || null
    }));

    res.status(200).json({
      users: formattedUsers,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNextPage: page * limit < totalUsers,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error getting users for admin:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user status (admin only)
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended', 'banned'].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be 'active', 'suspended', or 'banned'" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't allow changing admin status
    if (user.role === 'admin') {
      return res.status(403).json({ message: "Cannot change status of admin users" });
    }

    // Update user status
    user.status = status;
    user.statusUpdatedAt = new Date();
    await user.save();

    // If user is banned or suspended, also suspend their provider account if they have one
    if (status === 'banned' || status === 'suspended') {
      const provider = await Provider.findOne({ userId: id });
      if (provider && provider.status !== 'suspended') {
        provider.status = 'suspended';
        provider.statusUpdatedAt = new Date();
        await provider.save();
      }
    }

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      message: `User status updated to ${status} successfully`,
      user: userObj
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user verification status (admin only)
export const updateUserVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    if (typeof isVerified !== 'boolean') {
      return res.status(400).json({ message: "Invalid verification status. Must be a boolean value" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't allow changing admin verification
    if (user.role === 'admin') {
      return res.status(403).json({ message: "Cannot change verification status of admin users" });
    }

    // Update user verification status
    user.isVerified = isVerified;
    await user.save();

    // If user has provider role, ensure provider record exists and matches verification state
    if (user.role === 'provider') {
      let providerRecord = await Provider.findOne({ userId: user._id });

      if (isVerified && !providerRecord) {
        // Generate provider name from user data
        let providerName = '';
        if (user.firstName && user.lastName) {
          providerName = `${user.firstName} ${user.lastName}`;
        } else if (user.firstName) {
          providerName = user.firstName;
        } else if (user.lastName) {
          providerName = user.lastName;
        } else {
          // Use email username as fallback
          providerName = user.email.split('@')[0];
        }

        // Create provider with default values
        providerRecord = await Provider.create({
          userId: user._id,
          name: providerName,
          location: {
            address: "Location not set - Please update your profile",
            type: "Point",
            coordinates: [0, 0] // Default coordinates
          },
          status: "pending", // Provider needs to be approved separately
          languages: ['English'],
          responseTime: "within 24 hours"
        });

        console.log(`Provider record created for user ${user._id} during verification`);
      }

      if (providerRecord) {
        providerRecord.isVerified = isVerified;
        await providerRecord.save();
      }
    }

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      message: `User verification status updated to ${isVerified ? 'verified' : 'unverified'} successfully`,
      user: userObj
    });
  } catch (error) {
    console.error("Error updating user verification:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}; 