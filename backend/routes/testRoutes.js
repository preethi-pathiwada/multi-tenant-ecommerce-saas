import express from "express";

import User from "../models/User.js";
import Store from "../models/Store.js";     
import Product from "../models/Product.js";

const router = express.Router();

router.post("/create-test-data", async (req, res) => {
    try{
        const vendor = await User.create({
            name:"Preethi",
            email:"abc@gmail.com",
            password:"123456",
            role:"VENDOR"
        })

        const store = await Store.create({
        name: "Test Fashion Store",
        slug: `test-fashion-${Date.now()}`,
        owner: vendor._id,
        });

        const product = await Product.create({
        name: "Test Blue Shirt",
        description: "Temporary product for testing",
        price: 999,
        stock: 10,
        images: [],
        store: store._id,
        });

        res.status(201).json({
            message:"Test data created successfully",
            data:{
                vendor, 
                store,
                product
            }
        })
    }
    catch(error){
        res.status(500).json({
            message: "Failed to create test data",
            error: error.message
        })
    }
})

export default router;