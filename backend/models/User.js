import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["client", "provider", "admin"],
      default: "client",
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    profileImage: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

export default mongoose.model("User", userSchema);
