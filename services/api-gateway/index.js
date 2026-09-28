import "dotenv/config";
import app from "./src/app/app.js";

const port = process.env.PORT || 3000;



app.listen(port,()=>{
    console.log(`api gateway is running in ${port}`);
    
})