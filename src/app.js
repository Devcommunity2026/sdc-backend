import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoute from './routes/authentication.js'
import profileRoute from './routes/profile.js'
import errorHandler from './middlewares/errorHandlerMiddleware.js'

const app = express()

// MiddleWares
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(cookieParser())
app.use(express.json())


app.get('/test', (req, res) => {
    res.send('Test Passed')
})// test Route to check Server status 


app.use('/auth', authRoute) // Authentication route
app.use('/profile', profileRoute) // profile route


// middleware which will handel Errors
app.use(errorHandler)

export default app