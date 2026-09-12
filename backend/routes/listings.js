const express = require('express')
const { requireAuth } = require('../middleware/authMiddleware')
const {
    createListing,
    getListing,
    getListings,
    getMyListings,
    deleteListing,
    updateListing
} = require('../controllers/listingController')


const router = express.Router()


//GET all listings
router.get('/', getListings)

//GET current user's listings
router.get('/mine/host', requireAuth, getMyListings)

//GET a single listing
router.get('/:id', getListing)

//POST a new listing
router.post('/', requireAuth, createListing)

//DELETE a listing
router.delete('/:id', requireAuth, deleteListing)

//UPDATE a listing
router.patch('/:id', requireAuth, updateListing)

module.exports = router