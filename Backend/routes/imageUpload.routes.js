import express from "express";
const router = express.Router();
import Customer from "../models/customer.model.js";
import upload from "../middleware/multer.js";
// Get all
router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

// Get by Id
router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  res.json(customer);
});

// Add

router.post("/", upload.single("image"), async (req, res) => {
  console.log("File received:", req.file); // add debug log
  console.log("Body:", req.body);

  const newCust = new Customer({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    image: req.file ? req.file.filename : null
  });

  await newCust.save();
  res.json(newCust);
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
    };
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const cust = await Customer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true } // return updated doc
    );

    if (!cust) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(cust);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Delete
router.delete("/:id", async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

export default router;