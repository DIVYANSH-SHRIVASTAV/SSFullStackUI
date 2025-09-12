import connectDB from "./config/db.js";
import express from "express";
import dotenv from "dotenv";
import stateRoutes from "./routes/state.routes.js";
import countryRoutes from "./routes/country.routes.js";
import languageRoutes from "./routes/language.routes.js";
import customerRoutes from "./routes/imageUpload.routes.js";
import cors from "cors";
const app = express();
// serve uploaded images

// const customerRoutes = require("./routes/customerRoutes");
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form data
app.use(cors());

// MongoDB Connection


// Routes
app.use("/uploads", express.static("uploads")); 
app.use("/api/customers", customerRoutes);
app.use("/api/states", stateRoutes);
app.use("/api/languages", languageRoutes);
app.use("/api/countries", countryRoutes);

app.listen(5000, () => {
  console.log("server is running on " + "http://localhost:5000");
  connectDB();});
// http://localhost:5000/api/countries