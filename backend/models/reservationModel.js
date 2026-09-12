const mongoose = require('mongoose')

const Schema = mongoose.Schema

const reservationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookedBy: {
        type: String,
        required: true
    },
    listing: {
        type: Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    propertyName: {
        type: String,
        required: true
    },
    checkInDate: {
        type: String,
        required: true
    },
    checkOutDate: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Reservation', reservationSchema)
