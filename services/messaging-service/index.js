import "dotenv/config";
import { connectDB } from "./src/config/db.js";
import httpServer from "./src/app/app.js";


const port = process.env.PORT || 3004;





connectDB()
httpServer.listen(port, () => {
  console.log(`message-server is running in port ${port}`);
});
