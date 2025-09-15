import express from "express";
import District from "../models/district.model.js";

const router = express.Router();

// Get all with population (so UI gets country/state names directly if needed)
// router.get("/", async (req, res) => {
//   const districts = await District.find()
//     .populate("countryId", "name")
//     .populate("stateId", "name");
//   res.json(districts);
// });

// // Get by Id
// router.get("/:id", async (req, res) => {
//   const district = await District.findById(req.params.id)
//     .populate("countryId", "name")
//     .populate("stateId", "name");
//   res.json(district);
// });
// Get all with country + state populated
// Get all districts with populated country + state
router.get("/", async (req, res) => {
  try {
    const districts = await District.find()
      .populate("countryId", "name")  // only fetch name
      .populate("stateId", "name");
    res.json(districts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get district by ID with populated country + state
router.get("/:id", async (req, res) => {
  try {
    const district = await District.findById(req.params.id)
      .populate("countryId", "name")
      .populate("stateId", "name");
    res.json(district);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create
router.post("/", async (req, res) => {
  const district = new District(req.body);
  await district.save();
  res.json({ message: "District added successfully!" });
});

// Update
router.put("/:id", async (req, res) => {
  await District.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "District updated successfully!" });
});

// Delete
router.delete("/:id", async (req, res) => {
  await District.findByIdAndDelete(req.params.id);
  res.json({ message: "District deleted successfully!" });
});

export default router;
