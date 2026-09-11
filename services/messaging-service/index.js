import express from "express"
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
dotenv.config()
const port = process.env.PORT||3004 

const app =express()
connectDB()

app.listen(3004,()=>{
    console.log(`api gateway is running in port ${port}`);
    
})