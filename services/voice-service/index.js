import app from "./src/app/app.js"
import dotenv from "dotenv"
dotenv.config()


 const port = process.env.PORT || 3005


app.listen(port,()=>{
    console.log(`voice service is runnig in port ${port}`);
    
})