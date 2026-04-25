import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoute from './routes/authentication.js'


const app = express()

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

// Authentication route
app.use('/auth',authRoute)



export default app