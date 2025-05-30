import Provider from "../models/Provider.js";

// create a new provider
export const createProvider = async (req, res) => {
  try {
    // Extract user ID from decoded JWT (set in protect middleware)
    const userId = req.user.id;

    // Prevent creating multiple providers for the same user
    const existingProvider = await Provider.findOne({ userId });
    if (existingProvider) {
      return res
        .status(400)
        .json({ message: "You already have a provider profile." });
    }

    const { name, services, location } = req.body;

    const newProvider = new Provider({
      userId,
      name,
      services,
      location,
    });

    const savedProvider = await newProvider.save();

    res.status(201).json(savedProvider);
  } catch (error) {
    console.error("Error creating provider:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// get all providers
export const getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.find().populate("userId", "-password");
    res.json(providers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get provider by id
export const getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).populate(
      "userId",
      "-password"
    );
    if (!provider) return res.status(404).json({ error: "Provider not found" });
    res.json(provider);
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
