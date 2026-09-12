const Listing = require('../models/listingModel')
const mongoose = require('mongoose')

const isListingOwner = (listing, userId) => {
    return listing.host && listing.host.toString() === userId.toString()
}

//get all listings
const getListings = async (req, res) => {
    const listings = await Listing.find({}).sort({createdAt: -1})

    res.status(200).json(listings)
}


//get a single listing
const getListing = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such listing"})
    }

    const listing = await Listing.findById(id)

    if(!listing) {
        return res.status(404).json({error: "No such listing"})
    }

    res.status(200).json(listing)
}


const getMyListings = async (req, res) => {
    try {
        const listings = await Listing
            .find({ host: req.user._id })
            .sort({ createdAt: -1 })

        res.status(200).json(listings)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//create new listing
const createListing = async(req, res) => {
    const {accommodationType, title, location, description, maxGuests, bedrooms, bathrooms, amenities, images, price, rating, reviewCount} = req.body

    // add document to database
    try{
        const listingData = {
            accommodationType,
            title,
            location,
            description,
            maxGuests,
            bedrooms,
            bathrooms,
            amenities,
            images,
            price,
            rating,
            reviewCount
        }

        if (req.user) {
            listingData.host = req.user._id
        }

        const listing = await Listing.create(listingData)
        res.status(200).json(listing)
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}

//delete a listing
const deleteListing = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such listing"})
    }

    const listing = await Listing.findById(id)

    if(!listing) {
        return res.status(404).json({error: "No such listing"})
    }

    if (req.user && !isListingOwner(listing, req.user._id)) {
        return res.status(403).json({ error: 'Not authorized to delete this listing' })
    }

    await Listing.findByIdAndDelete(id)

    res.status(200).json(listing)
}


//update a listing
const updateListing = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such listing"})
    }

    const existingListing = await Listing.findById(id)

    if(!existingListing) {
        return res.status(404).json({error: "No such listing"})
    }

    if (req.user && !isListingOwner(existingListing, req.user._id)) {
        return res.status(403).json({ error: 'Not authorized to update this listing' })
    }

    const listing = await Listing.findOneAndUpdate(
        { _id: id },
        { ...req.body },
        { new: true }
    )

    res.status(200).json(listing)
}


module.exports = {
    getListings,
    getListing,
    getMyListings,
    createListing,
    deleteListing,
    updateListing
}