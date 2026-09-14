import './AllListings.css'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'
import { API_URL } from '../config'

const AllListings = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [listings, setListings] = useState([])
    const [error, setError] = useState(null)

    const locationFilter = searchParams.get('location')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const filteredListings = useMemo(() => {
        if (!locationFilter) return listings

        return listings.filter((listing) =>
            listing.title === locationFilter ||
            listing.location.toLowerCase().includes(locationFilter.toLowerCase())
        )
    }, [listings, locationFilter])

    const pageTitle = locationFilter
        ? `Listings in ${locationFilter}`
        : 'All Listings'

    const dateLabel = startDate && endDate
        ? `${startDate} → ${endDate}`
        : startDate
            ? `From ${startDate}`
            : endDate
                ? `Until ${endDate}`
                : null

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await fetch(`${API_URL}/api/listings`)

                if (!response.ok) {
                    throw new Error('Failed to fetch listings')
                }

                const contentType = response.headers.get('content-type') || ''

                if (!contentType.includes('application/json')) {
                    throw new Error('Could not reach the listings API. Make sure the backend is running on port 4000.')
                }

                const data = await response.json()
                setListings(data)
            } catch (err) {
                setError(err.message)
            }
        }

        fetchListings()
    }, [])

    const buildMetaLine = (listing) => {
        const parts = [
            `${listing.maxGuests} guests`,
            listing.accommodationType,
            `${listing.bedrooms} bedrooms`,
            `${listing.bathrooms} bathrooms`,
            ...listing.amenities
        ]

        return parts.join(' · ')
    }

    return (
        <div className="all-listings">
            <div className="all-listings-header">
                <h1>{pageTitle}</h1>
                {dateLabel && <p className="all-listings-dates">{dateLabel}</p>}
            </div>

            {error && <p className="all-listings-error">{error}</p>}

            {!error && filteredListings.length === 0 && (
                <p className="all-listings-empty">No listings found for this search.</p>
            )}

            <div className="all-listings-grid">
                {filteredListings.map((listing) => (
                    <div
                        className="listing-card"
                        key={listing._id}
                        onClick={() => {
                            const query = searchParams.toString()
                            navigate(query ? `/listings/${listing._id}?${query}` : `/listings/${listing._id}`)
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const query = searchParams.toString()
                                navigate(query ? `/listings/${listing._id}?${query}` : `/listings/${listing._id}`)
                            }
                        }}
                    >
                        <div className="listing-image">
                            <img src={listing.images[0]} alt={listing.title} />
                        </div>

                        <div className="listing-details">
                            <p className="listing-accommodation-type">{listing.accommodationType}</p>

                            <p className="listing-location">
                                <span className="listing-location-text">{listing.location}</span>
                            </p>

                            <p className="listing-meta">{buildMetaLine(listing)}</p>

                            <div className="listing-footer">
                                <p className="listing-rating">
                                    <FaStar className="listing-star" />
                                    {listing.rating}
                                </p>
                                <p className="listing-price">
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

export default AllListings
