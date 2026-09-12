const express = require('express')
const { requireAuth } = require('../middleware/authMiddleware')
const {
    createReservation,
    getReservations,
    deleteReservation
} = require('../controllers/reservationController')

const router = express.Router()

router.use(requireAuth)

router.get('/', getReservations)
router.post('/', createReservation)
router.delete('/:id', deleteReservation)

module.exports = router
