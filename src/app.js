import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoute from './routes/authentication.js'


const app = express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));



app.use(cookieParser())
app.use(express.json())

// test Route to check Server status 
app.get('/test', (req, res) => {
    res.send('Test Passed')
})

// Authentication route
app.use('/auth',authRoute)



export default app