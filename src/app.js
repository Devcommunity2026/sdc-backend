import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

console.log(process.env.FRONTEND_URL)
const app = express()
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(cookieParser())
app.use(express.json())

app.get('/test', (req, res) => {
    res.send('Test Passed')
})

export default app