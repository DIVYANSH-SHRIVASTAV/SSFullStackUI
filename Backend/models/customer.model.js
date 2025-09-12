import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  mobile: { type: String },
  image: { type: String }
});
const Customer = mongoose.model("Customer", CustomerSchema);
export default Customer;