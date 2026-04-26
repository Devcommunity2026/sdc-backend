import dotenv from "dotenv";
dotenv.config();  // 🔥 MUST BE FIRST

import app from "./app.js";
import connectDb from "./config/connectDb.js";

const PORT = process.env.PORT || 5000;

connectDb().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${PORT}`);
    });
});