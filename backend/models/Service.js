import mongoose from "mongoose";
const { Schema } = mongoose;

const serviceSchema = new Schema(
  {
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
