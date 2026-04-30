import dotenv from "dotenv";
import app from "./app.js";
import connectDb from "./config/connectDb.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log("Listening on port", PORT);
  });
});