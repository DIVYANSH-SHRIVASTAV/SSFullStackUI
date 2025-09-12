import express from 'express';
const router=express.Router();
import Country from '../models/country.model.js'

router.get("/",async(req,res)=>{
    await Country.find().then((countries)=>res.json(countries)).catch((err)=>res.status(400).json("Error in country fetching:"+err));
})
router.post("/", async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Country name is required" });
    try {
        await new Country({ name }).save();
        res.json("Country added successfully");
    } catch (err) {
        res.status(400).json({ error: "Error in country adding: " + err });
    }
});
router.put("/:id",async(req,res)=>{
    const {name}=req.body;
  
    await Country.findByIdAndUpdate(req.params.id,{name}).then(()=>{res.json("Country updated successfully")}).catch((err)=>{
        res.status(400).json("Error in country updating "+err);
    })
})
router.delete("/:id",async(req,res)=>{
    await Country.findByIdAndDelete(req.params.id).then(()=>{res.json("Country deleted successfully")}).catch((err)=>{
        res.status(400).json("Error in country deleting "+err);
    })
})
export default router;