import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["client", "provider", "admin"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
