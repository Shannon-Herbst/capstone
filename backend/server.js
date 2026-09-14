require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const listingRoutes = require('./routes/listings')
const authRoutes = require('./routes/auth')
const reservationRoutes = require('./routes/reservations')

//express app
const app = express()

//middleware
app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Capstone API is running' })
})

app.use('/api/listings', listingRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/reservations', reservationRoutes)

const port = process.env.PORT || 4000

app.listen(port, '0.0.0.0', () => {
    console.log('Server listening on port', port)

    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI environment variable is not set')
        return
    }

    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Connected to MongoDB')
        })
        .catch((error) => {
            console.error('MongoDB connection error:', error.message)
        })
})



