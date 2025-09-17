
import express from "express";
const router = express.Router();
import Student from "../models/student.model.js";
// GET all students
// router.get("/", async (req, res) => {
//   const students = await Student.find();
//   res.json(students);
// });
router.get("/", async (req, res) => {
  const students = await Student.find()
    // .populate("country", "name")
    // .populate("state", "name")
    // .populate("district", "name");
  res.json(students);
});
// POST add student


// Search endpoint
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q || "";
    const students = await Student.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ]
    });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update student
router.put("/:id", async (req, res) => {
  await Student.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Student updated successfully!" });
});

// DELETE student
router.delete("/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Student deleted successfully!" });
});

export default router;