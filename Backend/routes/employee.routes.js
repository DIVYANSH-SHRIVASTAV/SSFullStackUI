import express from "express";
import Employee from "../models/employee.model.js";

const router = express.Router();

// @desc Get all users
// @route GET /api/users
router.get("/", async (req, res) => {
  try {
    const users = await Employee.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Add new user
// @route POST /api/users
router.post("/", async (req, res) => {
  try {
    const { name, email, mobile, languages } = req.body;

    const newUser = new Employee({ name, email, mobile, languages });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Update user
// @route PUT /api/users/:id
router.put("/:id", async (req, res) => {
  try {
    const { name, email, mobile, languages } = req.body;

    const updatedUser = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, email, mobile, languages },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Delete user
// @route DELETE /api/users/:id
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await Employee.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
