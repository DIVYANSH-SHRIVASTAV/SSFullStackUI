import { Parser } from "json2csv";
import express from "express";
const router = express.Router();
import Student from "../models/student.model.js";

router.get("/", async (req, res) => {
  const students = await Student.find()
    
  res.json(students);
});
router.get("/export", async (req, res) => {
  try {
    // Populate country, state, district (sirf name field laao)
    const students = await Student.find()
      .populate("country", "name")
      .populate("state", "name")
      .populate("district", "name")
      .lean();

    // Map into CSV-ready format
    const data = students.map((s) => ({
      name: s.name || "",
      email: s.email || "",
      mobile: s.mobile || "",
      gender: s.gender || "",
      country: s.country?.name || "",   // <- yahan _id nahi, name use karo
      state: s.state?.name || "",
      district: s.district?.name || "",
    }));

    // Convert to CSV
    const fields = ["name", "email", "mobile", "gender", "country", "state", "district"];
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    // Response
    res.header("Content-Type", "text/csv");
    res.attachment("students.csv");
    res.send(csv);
  } catch (err) {
    console.error("CSV Export Error:", err);
    res.status(500).json({ error: "Error generating CSV" });
  }
});

router.get("/paginated", async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const totalRecords = await Student.countDocuments();
    const students = await Student.find()
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    res.json({
      totalRecords,
      pageNumber,
      pageSize,
      data: students,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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