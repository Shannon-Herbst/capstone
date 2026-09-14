import './MyReservations.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HostToolbar from '../components/HostToolbar'
import { API_URL } from '../config'
import { formatDisplayDate } from '../utils/dates'

const MyReservations = () => {
    const navigate = useNavigate()
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (!token) {
            navigate('/login')
            return
        }

        const fetchReservations = async () => {
            try {
                const response = await fetch(`${API_URL}/api/reservations`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to load reservations')
                }

                setReservations(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchReservations()
    }, [navigate])

    const handleDelete = async (reservationId) => {
        const token = localStorage.getItem('token')

        if (!token) {
            navigate('/login')
            return
        }

        try {
            const response = await fetch(`${API_URL}/api/reservations/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete reservation')
            }

            setReservations((prev) => prev.filter((reservation) => reservation._id !== reservationId))
        } catch (err) {
            alert(err.message)
        }
    }

    if (loading) {
        return (
            <div className="my-reservations">
                <p className="my-reservations-loading">Loading...</p>
            </div>
        )
    }

    return (
        <div className="my-reservations">
            <HostToolbar />
            <h1>My Reservations</h1>

            {error && <p className="my-reservations-error">{error}</p>}

            {!error && reservations.length === 0 && (
                <p className="my-reservations-empty">You have no reservations yet.</p>
            )}

            {!error && reservations.length > 0 && (
                <div className="my-reservations-table-wrapper">
                    <table className="my-reservations-table">
                        <thead>
                            <tr>
                                <th>Booked by</th>
                                <th>Property name</th>
                                <th>Check in date</th>
                                <th>Checkout date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((reservation) => (
                                <tr key={reservation._id}>
                                    <td>{reservation.bookedBy}</td>
                                    <td>{reservation.propertyName}</td>
                                    <td>{formatDisplayDate(reservation.checkInDate)}</td>
                                    <td>{formatDisplayDate(reservation.checkOutDate)}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="my-reservations-delete"
                                            onClick={() => handleDelete(reservation._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default MyReservations
