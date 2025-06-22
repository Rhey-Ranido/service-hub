import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { validateRegistration } from "../utils/validateRegistration.js";

const formatUserResponse = (user) => ({
  user: { id: user._id, email: user.email, role: user.role },
  token: generateToken(user),
});
export const register = async (req, res) => {
  let { email, password, role } = req.body;

  try {
    // Default role to "client" if not provided
    role = role || "client";

    // Input validation
    validateRegistration(email, password, role);

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create user
    const user = await User.create({ email, password, role });

    // Respond
    res.status(201).json(formatUserResponse(user));
  } catch (err) {
    const statusCode = err.message.includes("Invalid") ? 400 : 500;
    res
      .status(statusCode)
      .json({ message: "Registration failed", error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });
    const validPassword = user && (await user.comparePassword(password));

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Respond
    res.status(200).json(formatUserResponse(user));
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// Controller: Get authenticated user info
export const getMe = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error("Error in getMe:", err);
    res.status(500).json({ message: "Server error" });
  }
};
