import User from "../models/User.js";
import Provider from "../models/Provider.js";
import bcrypt from "bcryptjs";

// GET current user profile with detailed information
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is also a provider
    let providerInfo = null;
    if (user.role === 'provider') {
      providerInfo = await Provider.findOne({ userId: user._id })
        .select('name bio location rating totalReviews totalServices isVerified status categories skills languages responseTime completedProjects socialLinks');
    }

    // Generate image URLs - use user's profile image for both user and provider
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads`;
    const profileImageUrl = user.profileImage ? `${baseUrl}/${user.profileImage}` : null;

    const response = {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        profileImageUrl,
        isVerified: user.isVerified,
        lastActive: user.lastActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };

    if (providerInfo) {
      response.provider = {
        ...providerInfo.toObject(),
        profileImage: user.profileImage, // Use user's profile image
        profileImageUrl: profileImageUrl  // Use user's profile image URL
      };
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE user profile information
export const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const userId = req.user.id;

    // Validate input
    const updates = {};
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (phone !== undefined) updates.phone = phone;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate profile image URL
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads`;
    const profileImageUrl = updatedUser.profileImage ? `${baseUrl}/${updatedUser.profileImage}` : null;

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        ...updatedUser.toObject(),
        profileImageUrl
      }
    });

  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE user email (with additional verification)
export const updateUserEmail = async (req, res) => {
  try {
    const { email, currentPassword } = req.body;
    const userId = req.user.id;

    if (!email || !currentPassword) {
      return res.status(400).json({ message: "Email and current password are required" });
    }

    // Get current user with password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Check if email is already taken
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // Update email and set as unverified
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        email: email.toLowerCase(),
        isVerified: false  // Email change requires re-verification
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      message: "Email updated successfully. Please verify your new email address.",
      user: updatedUser
    });

  } catch (error) {
    console.error("Error updating email:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// CHANGE user password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ 
        message: "Current password, new password, and confirmation are required" 
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    // Get user with password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Update password (will be hashed by the pre-save middleware)
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE user account
export const deleteUserAccount = async (req, res) => {
  try {
    const { password, confirmDelete } = req.body;
    const userId = req.user.id;

    if (!password || confirmDelete !== 'DELETE') {
      return res.status(400).json({ 
        message: "Password and confirmation (type 'DELETE') are required" 
      });
    }

    // Get user with password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    // If user is a provider, delete provider profile too
    if (user.role === 'provider') {
      await Provider.findOneAndDelete({ userId });
    }

    // Delete user account
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Account deleted successfully" });

  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE account preferences/settings
export const updateAccountSettings = async (req, res) => {
  try {
    const { lastActive } = req.body;
    const userId = req.user.id;

    const updates = {};
    if (lastActive !== undefined) updates.lastActive = lastActive;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Settings updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
