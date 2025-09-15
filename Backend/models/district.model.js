
import mongoose from "mongoose";

const DistrictSchema = new mongoose.Schema({
  name: { type: String, required: true },
  countryId: { type: mongoose.Schema.Types.ObjectId, ref: "Country", required: true },
  stateId: { type: mongoose.Schema.Types.ObjectId, ref: "State", required: true }
});

const District = mongoose.model("District", DistrictSchema);
export default District;