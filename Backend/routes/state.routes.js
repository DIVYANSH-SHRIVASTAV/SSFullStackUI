import express from "express";
const router = express.Router();
import State from "../models/state.model.js";
// Get all states
router.get("/", async (req, res) => {
  const states = await State.find();
  res.json(states);
});

// Get state by ID
router.get("/:id", async (req, res) => {
  const state = await State.findById(req.params.id);
  res.json(state);
});


router.post("/", async (req, res) => {
  try {
    const state = new State(req.body);
    await state.save();
    res.status(201).json(state);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update state
router.put("/:id", async (req, res) => {
const Updated=  await State.findByIdAndUpdate(req.params.id, req.body,{ new: true });
   res.status(200).json(Updated);
});

// Delete state
router.delete("/:id", async (req, res) => {
  await State.findByIdAndDelete(req.params.id);
  res.json({ message: "State deleted successfully!" });
});
export default router;