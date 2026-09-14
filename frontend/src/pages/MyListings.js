import './MyListings.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HostToolbar from '../components/HostToolbar'
import { FaStar } from 'react-icons/fa'
import { API_URL } from '../config'

const MyListings = () => {
    const navigate = useNavigate()
    const [listings, setListings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (!token) {
            navigate('/login?redirect=/my-listings')
            return
        }

        const fetchListings = async () => {
            try {
                const response = await fetch(`${API_URL}/api/listings/mine/host`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to load listings')
                }

                setListings(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchListings()
    }, [navigate])

    const buildMetaLine = (listing) => {
        return [
            `${listing.bedrooms} bedrooms`,
            `${listing.bathrooms} bathrooms`,
            ...listing.amenities,
            listing.accommodationType
        ].join(' · ')
    }

    const handleDelete = async (listingId) => {
        const token = localStorage.getItem('token')

        if (!token) {
            navigate('/login?redirect=/my-listings')
            return
        }

        if (!window.confirm('Are you sure you want to delete this listing?')) {
            return
        }

        try {
            const response = await fetch(`${API_URL}/api/listings/${listingId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete listing')
            }

            setListings((prev) => prev.filter((listing) => listing._id !== listingId))
        } catch (err) {
            alert(err.message)
        }
    }

    if (loading) {
        return (
            <div className="my-listings">
                <p className="my-listings-loading">Loading...</p>
            </div>
        )
    }

    return (
        <div className="my-listings">
            <HostToolbar />
            <h1>My Listings</h1>

            {error && <p className="my-listings-error">{error}</p>}

            {!error && listings.length === 0 && (
                <p className="my-listings-empty">You do not have any listings yet.</p>
            )}

            <div className="my-listings-grid">
                {listings.map((listing) => (
                    <div className="my-listing-card" key={listing._id}>
                        <div className="my-listing-left">
                            <div className="my-listing-image">
                                <img src={listing.images[0]} alt={listing.title} />
                            </div>
                            <div className="my-listing-actions">
                                <button
                                    type="button"
                                    className="my-listing-update"
                                    onClick={() => navigate(`/my-listings/${listing._id}/edit`)}
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    className="my-listing-delete"
                                    onClick={() => handleDelete(listing._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        <div className="my-listing-details">
                            <p className="my-listing-type">{listing.accommodationType}</p>
                            <h2>Charming Home in {listing.location}</h2>
                            <p className="my-listing-meta">{buildMetaLine(listing)}</p>
                            <div className="my-listing-footer">
                                <p className="my-listing-rating">
                                    <FaStar className="my-listing-star" />
                                    {listing.rating}
                                </p>
                                <p className="my-listing-price">
                                    <strong>${listing.price}</strong> / night
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyListings
