import express from "express";
const router = express.Router();
import Language from "../models/language.model.js";

// GET all languages
router.get("/", async (req, res) => {
  const languages = await Language.find();
  res.json(languages);
});

// GET by ID
router.get("/:id", async (req, res) => {
  const language = await Language.findById(req.params.id);
  res.json(language);
});

// POST create
router.post("/", async (req, res) => {
  const language = new Language(req.body);
  await language.save();
  res.json({ message: "Language added successfully!" });
});

// PUT update
router.put("/:id", async (req, res) => {
  await Language.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Language updated successfully!" });
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Language.findByIdAndDelete(req.params.id);
  res.json({ message: "Language deleted successfully!" });
});

export default router;