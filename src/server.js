import "dotenv/config";   
import app from "./app.js";
import connectDb from "./config/connectDb.js";
const PORT = process.env.PORT || 5000;

connectDb().then(()=>{
    app.listen(PORT, () => {
        console.log('Listening on port ', process.env.PORT)
    })
})