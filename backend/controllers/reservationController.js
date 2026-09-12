const Reservation = require('../models/reservationModel')
const Listing = require('../models/listingModel')

const createReservation = async (req, res) => {
    const { listingId, checkInDate, checkOutDate } = req.body

    if (!listingId || !checkInDate || !checkOutDate) {
        return res.status(400).json({ error: 'Listing and dates are required' })
    }

    if (checkOutDate <= checkInDate) {
        return res.status(400).json({ error: 'Check-out date must be after check-in date' })
    }

    try {
        const listing = await Listing.findById(listingId)

        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' })
        }

        const reservation = await Reservation.create({
            user: req.user._id,
            bookedBy: req.user.username,
            listing: listingId,
            propertyName: listing.location,
            checkInDate,
            checkOutDate
        })

        res.status(201).json(reservation)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getReservations = async (req, res) => {
    try {
        const reservations = await Reservation
            .find({ user: req.user._id })
            .sort({ createdAt: -1 })

        res.status(200).json(reservations)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findOne({
            _id: req.params.id,
            user: req.user._id
        })

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' })
        }

        await Reservation.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Reservation deleted' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    createReservation,
    getReservations,
    deleteReservation
}
