import app from "./src/app/app.js";
import dotenv from "dotenv"
import { connectDB } from "./src/config/db.js";
dotenv.config()


const port = process.env.PORT || 3003
connectDB()

app.listen(port,()=>{
    console.log(`guild service is running in port ${port}`);
    
})