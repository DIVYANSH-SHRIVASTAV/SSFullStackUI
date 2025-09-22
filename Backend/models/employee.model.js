import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // prevent duplicate emails
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    mobile: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Mobile number must be 10 digits"],
    },
    languages: {
      type: [String],
      enum: ["English", "Hindi", "French"], // only allow these 3
      default: [],
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", userSchema);

export default Employee;
