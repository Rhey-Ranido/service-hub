import mongoose from "mongoose";
const { Schema } = mongoose;

const providerSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    services: [{ type: String }], // optional for lightweight service listing
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

providerSchema.index({ location: "2dsphere" });

export default mongoose.model("Provider", providerSchema);
