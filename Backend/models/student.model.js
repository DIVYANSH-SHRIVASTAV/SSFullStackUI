import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  mobile: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true }, // added "Other"
  country: { type: mongoose.Schema.Types.ObjectId, ref: "Country" },
  state: { type: mongoose.Schema.Types.ObjectId, ref: "State" },
  district: { type: mongoose.Schema.Types.ObjectId, ref: "District" },
});

const Student = mongoose.model("Student", studentSchema);
export default Student;
