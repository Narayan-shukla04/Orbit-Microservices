import app from "./src/app/app.js";
import dotenv from "dotenv"
import { connectDB } from "./src/config/db.js";
import redis from "./src/config/redis.js";
dotenv.config()

const port =process.env.PORT

connectDB()
 redis.on("connect",()=>{
    console.log("redis Db connected");
    
 })

app.listen(port,()=>{
    console.log(`auth service run in port ${port}`);
    
    
})