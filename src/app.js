import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDb from './config/connectDb.js'

const app = express()
connectDb()

// MiddleWares
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(cookieParser())
app.use(express.json())

// test Route to check Server status 
app.get('/test', (req, res) => {
    res.send('Test Passed')
})


export default app