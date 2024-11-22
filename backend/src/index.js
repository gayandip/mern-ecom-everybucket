import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./database/index.js";

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`server is running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB connection error", err.message);
  });
