import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoute from './routes/authentication.js'


const app = express()

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });


app.use(cookieParser())
app.use(express.json())

// test Route to check Server status 
app.get('/test', (req, res) => {
    res.send('Test Passed')
})

// Authentication route
app.use('/auth',authRoute)

app.get("/", (req, res) => {
    res.send("Server is working ✅");
  });



export default app