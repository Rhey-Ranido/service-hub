import ProviderReview from "../models/ProviderReview.js";
import Provider from "../models/Provider.js";

// @desc Get all reviews for a specific provider
// @route GET /api/provider-reviews/:providerId

export const getAllProviderReviews = async (req, res) => {
  try {
    const { providerId } = req.params;

    // Check if provider exists
    const providerExists = await Provider.findById(providerId);
    if (!providerExists) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Fetch provider reviews
    const reviews = await ProviderReview.find({ providerId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch provider reviews",
      error: error.message,
    });
  }
};

// @desc Create a review for a provider
// @route POST /api/provider-reviews/:providerId
export const createProviderReview = async (req, res) => {
  const { rating, comment } = req.body;
  const providerId = req.params.providerId;
  const userId = req.user._id;

  try {
    // Ensure provider exists
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Check if review already exists
    const existingReview = await ProviderReview.findOne({ providerId, userId });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this provider" });
    }

    const newReview = await ProviderReview.create({
      providerId,
      userId,
      rating,
      comment,
    });

    res.status(201).json(newReview);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create review", error: error.message });
  }
};

// @desc Update a provider review
// @route PUT /api/provider-reviews/:reviewId
export const updateProviderReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    // Find review by ID
    const review = await ProviderReview.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Ownership check
    if (review.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this review" });
    }

    // Update fields
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update provider review",
      error: error.message,
    });
  }
};

// @desc Delete a provider review
// @route DELETE /api/provider-reviews/:reviewId
export const deleteProviderReview = async (req, res) => {
  const reviewId = req.params.reviewId;

  try {
    const review = await ProviderReview.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this review" });
    }

    await review.deleteOne();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete review", error: error.message });
  }
};
