import mongoose from "mongoose";
const { Schema } = mongoose;

const providerSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    bio: { type: String },
    profileImage: { type: String },
    location: {
      address: { type: String, required: true }, // "San Francisco, CA"
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: false,
      },
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    totalReviews: { type: Number, default: 0 },
    totalServices: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
    },
    rejectionReason: { type: String },
    adminFeedback: { type: String },
    statusUpdatedAt: { type: Date },
    categories: [{ type: String }], // ["Technology", "Marketing"]
    skills: [{ type: String }], // ["React", "Node.js", "SEO"]
    languages: [{ type: String }], // ["English", "Spanish"]
    responseTime: { type: String, default: "within 24 hours" },
    completedProjects: { type: Number, default: 0 },
    socialLinks: {
      website: String,
      linkedin: String,
      twitter: String,
      github: String,
    },
  },
  { timestamps: true }
);

// Create 2dsphere index for location coordinates only (not the entire location object)
providerSchema.index({ "location": "2dsphere" });

export default mongoose.model("Provider", providerSchema);
