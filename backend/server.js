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
app.use('/api/listings', listingRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/reservations', reservationRoutes)

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //listen for requests
        app.listen(process.env.PORT, () => {
            console.log('connected to db & listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })



