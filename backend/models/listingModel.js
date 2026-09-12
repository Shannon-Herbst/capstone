const mongoose = require('mongoose')

const Schema = mongoose.Schema

const listingSchema = new Schema({
    host: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    accommodationType: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    maxGuests: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    reviewCount: {
        type: Number,
        required: true
    },
    bedrooms: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    amenities: {
        type: [String],
        required: true
    },
    images: {
        type: [String],
        required: true
    },
}, {timestamps: true})

module.exports = mongoose.model('Listing', listingSchema)
