import Provider from "../models/provider.js";

export const createProvider = async (req, res) => {
  try {
    const providerData = req.body;
    const newProvider = new Provider(providerData);
    await newProvider.save();
    res.status(201).json(newProvider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
