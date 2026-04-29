import express from 'express'
const router = express.Router()

// this is Route is major about the updation and fetching the user value 

router.get('/me', (req, res) => {
    console.log('hehe')
})

export default router