
import express from "express";
import axios from 'axios'

const router = express.Router();

router.get("/", async (req, res) => {
    const { address } = req.query;

    if (!address) {
        return res.status(400).send("Address is required");
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.Location_Key}`;
    
    try {
        const response = await axios.get(url);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching data from Google Maps API");
    }
});

export default router