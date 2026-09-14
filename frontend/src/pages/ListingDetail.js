import './ListingDetail.css'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'
import { API_URL } from '../config'
import { addDays, calculateNights, formatDisplayDate, getTodayString } from '../utils/dates'

const CLEANING_FEE = 50
const SERVICE_FEE = 50
const OCCUPANCY_FEE = 30

const FEATURED_AMENITIES = [
    'Garden View',
    'Free washer- in building',
    'Refrigerator',
    'Pets allowed',
    'Security cameras'
]

const LEFT_REVIEW_CATEGORIES = [
    { label: 'Cleanliness', score: 5.0 },
    { label: 'Communication', score: 4.7 },
    { label: 'Check-in', score: 4.8 }
]

const RIGHT_REVIEW_CATEGORIES = [
    { label: 'Accuracy', score: 3.0 },
    { label: 'Location', score: 5.0 },
    { label: 'Value', score: 4.7 }
]

const RatingBar = ({ label, score }) => (
    <div className="listing-detail-rating-row">
        <span className="listing-detail-rating-label">{label}</span>
        <div className="listing-detail-rating-bar-track">
            <div
                className="listing-detail-rating-bar-fill"
                style={{ width: `${(score / 5) * 100}%` }}
            />
        </div>
        <span className="listing-detail-rating-score">
            {Number.isInteger(score) ? score : score.toFixed(1)}
        </span>
    </div>
)

const ListingDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [listing, setListing] = useState(null)
    const [error, setError] = useState(null)
    const [startDate, setStartDate] = useState(() => searchParams.get('startDate') || '')
    const [endDate, setEndDate] = useState(() => searchParams.get('endDate') || '')

    const minCheckIn = getTodayString()
    const minCheckOut = startDate ? addDays(startDate, 1) : minCheckIn

    const nights = useMemo(
        () => calculateNights(startDate, endDate),
        [startDate, endDate]
    )

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const response = await fetch(`${API_URL}/api/listings/${id}`)

                if (!response.ok) {
                    throw new Error('Listing not found')
                }

                const data = await response.json()
                setListing(data)
            } catch (err) {
                setError(err.message)
            }
        }

        fetchListing()
    }, [id])

    useEffect(() => {
        const urlStart = searchParams.get('startDate') || ''
        const urlEnd = searchParams.get('endDate') || ''
        setStartDate(urlStart)
        setEndDate(urlEnd)
    }, [searchParams])

    const handleStartDateChange = (value) => {
        setStartDate(value)

        if (endDate && value && endDate <= value) {
            setEndDate('')
        }
    }

    const handleEndDateChange = (value) => {
        if (startDate && value <= startDate) return
        setEndDate(value)
    }

    const handleReserveClick = async () => {
        const token = localStorage.getItem('token')

        if (!token) {
            alert('Please log in to reserve this listing.')
            navigate('/login')
            return
        }

        if (!startDate || !endDate) {
            alert('Please select check-in and check-out dates.')
            return
        }

        try {
            const response = await fetch(`${API_URL}/api/reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    listingId: id,
                    checkInDate: startDate,
                    checkOutDate: endDate
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create reservation')
            }

            alert('Reservation added successfully!')
        } catch (err) {
            alert(err.message)
        }
    }

    if (error) {
        return (
            <div className="listing-detail">
                <p className="listing-detail-error">{error}</p>
            </div>
        )
    }

    if (!listing) {
        return (
            <div className="listing-detail">
                <p className="listing-detail-loading">Loading...</p>
            </div>
        )
    }

    const gridImages = listing.images.slice(1, 5)
    while (gridImages.length < 4) {
        gridImages.push(null)
    }

    const metaLine = [
        `${listing.maxGuests} guests`,
        listing.accommodationType,
        `${listing.bedrooms} bedrooms`,
        `${listing.bathrooms} bathrooms`
    ].join(' · ')

    const nightlyTotal = listing.price * nights
    const total = nightlyTotal + CLEANING_FEE + SERVICE_FEE + OCCUPANCY_FEE

    return (
        <div className="listing-detail">
            <h1 className="listing-detail-title">
                {listing.accommodationType} in {listing.location}
            </h1>

            <p className="listing-detail-rating">
                <FaStar className="listing-detail-star" />
                {listing.rating}
                <span className="listing-detail-review-count">({listing.reviewCount} reviews)</span>
            </p>

            <div className="listing-detail-gallery">
                <div className="listing-detail-main-image">
                    <img src={listing.images[0]} alt={listing.title} />
                </div>

                <div className="listing-detail-image-grid">
                    {gridImages.map((image, index) => (
                        <div className="listing-detail-grid-cell" key={index}>
                            {image && <img src={image} alt={`${listing.title} ${index + 2}`} />}
                        </div>
                    ))}
                </div>
            </div>

            <div className="listing-detail-body">
                <div className="listing-detail-main">
                    <h2 className="listing-detail-host">
                        {listing.accommodationType} hosted by Johan
                    </h2>

                    <p className="listing-detail-meta">{metaLine}</p>

                    <div className="listing-detail-highlights">
                        <div className="listing-detail-highlight">
                            <h3>{listing.accommodationType}</h3>
                            <p>You'll have the {listing.accommodationType.toLowerCase()} to yourself.</p>
                        </div>

                        <div className="listing-detail-highlight">
                            <h3>Enhanced Cleaning</h3>
                            <p>This Host is commited to Airbnb's 5-step enhanced cleaning process.</p>
                        </div>

                        <div className="listing-detail-highlight">
                            <h3>Self Check-In</h3>
                            <p>Check yourself in with the keypad.</p>
                        </div>

                        <div className="listing-detail-highlight">
                            <h3>Free cancellation before Feb 14</h3>
                        </div>
                    </div>

                    <hr className="listing-detail-divider" />

                    <p className="listing-detail-description">{listing.description}</p>

                    <section className="listing-detail-section">
                        <h2 className="listing-detail-section-title">Where You'll Sleep</h2>
                        <img
                            className="listing-detail-sleep-image"
                            src={listing.images[1] || listing.images[0]}
                            alt="Bedroom"
                        />
                        <p className="listing-detail-section-text">Spacious bedroom with comfortable bed.</p>
                        <p className="listing-detail-section-text">Total bedrooms: {listing.bedrooms}</p>
                    </section>

                    <hr className="listing-detail-divider" />

                    <section className="listing-detail-section">
                        <h2 className="listing-detail-section-title">What this place offers</h2>
                        <ul className="listing-detail-amenities">
                            {FEATURED_AMENITIES.map((amenity) => (
                                <li key={amenity}>{amenity}</li>
                            ))}
                        </ul>
                        <button type="button" className="listing-detail-amenities-button">
                            View all 26 amenities
                        </button>
                    </section>

                    <hr className="listing-detail-divider" />

                    <section className="listing-detail-section">
                        <h2 className="listing-detail-section-title">
                            {nights > 0
                                ? `${nights} ${nights === 1 ? 'Night' : 'Nights'} in ${listing.location}`
                                : `Nights in ${listing.location}`}
                        </h2>

                        <p className="listing-detail-stay-dates-display">
                            {startDate && endDate
                                ? `${formatDisplayDate(startDate)} – ${formatDisplayDate(endDate)}`
                                : 'Select your check-in and check-out dates'}
                        </p>

                        <div className="listing-detail-stay-dates">
                            <div className="listing-detail-stay-date-field">
                                <label htmlFor="stay-check-in">Check in</label>
                                <input
                                    id="stay-check-in"
                                    type="date"
                                    value={startDate}
                                    min={minCheckIn}
                                    onChange={(e) => handleStartDateChange(e.target.value)}
                                />
                            </div>
                            <div className="listing-detail-stay-date-field">
                                <label htmlFor="stay-check-out">Check out</label>
                                <input
                                    id="stay-check-out"
                                    type="date"
                                    value={endDate}
                                    min={minCheckOut}
                                    disabled={!startDate}
                                    onChange={(e) => handleEndDateChange(e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                    <hr className="listing-detail-divider" />

                    <section className="listing-detail-section listing-detail-reviews">
                        <h2 className="listing-detail-reviews-heading">
                            <FaStar className="listing-detail-star" />
                            {listing.rating} · {listing.reviewCount} reviews
                        </h2>

                        <div className="listing-detail-rating-columns">
                            <div className="listing-detail-rating-column">
                                {LEFT_REVIEW_CATEGORIES.map((category) => (
                                    <RatingBar
                                        key={category.label}
                                        label={category.label}
                                        score={category.score}
                                    />
                                ))}
                            </div>

                            <div className="listing-detail-rating-column">
                                {RIGHT_REVIEW_CATEGORIES.map((category) => (
                                    <RatingBar
                                        key={category.label}
                                        label={category.label}
                                        score={category.score}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                <div className="listing-detail-booking-card">
                    <div className="booking-card-header">
                        <p className="booking-card-price">
                            <strong>${listing.price}</strong> / night
                        </p>
                        <p className="booking-card-rating">
                            <FaStar className="listing-detail-star" />
                            {listing.rating}
                        </p>
                    </div>

                    <div className="booking-card-dates">
                        <div className="booking-card-date-field">
                            <label htmlFor="check-in">Check in</label>
                            <input
                                id="check-in"
                                type="date"
                                value={startDate}
                                min={minCheckIn}
                                onChange={(e) => handleStartDateChange(e.target.value)}
                            />
                        </div>
                        <div className="booking-card-date-field">
                            <label htmlFor="check-out">Check out</label>
                            <input
                                id="check-out"
                                type="date"
                                value={endDate}
                                min={minCheckOut}
                                disabled={!startDate}
                                onChange={(e) => handleEndDateChange(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        className="booking-card-reserve"
                        disabled={nights === 0}
                        onClick={handleReserveClick}
                    >
                        Reserve
                    </button>

                    <p className="booking-card-note">You won't be charged yet</p>

                    <div className="booking-card-breakdown">
                        <div className="booking-card-row">
                            <span>
                                {nights > 0
                                    ? `$${listing.price} x ${nights} ${nights === 1 ? 'night' : 'nights'}`
                                    : 'Select dates to see pricing'}
                            </span>
                            <span>${nightlyTotal}</span>
                        </div>
                        <div className="booking-card-row">
                            <span>Weekly discount</span>
                            <span>-$0</span>
                        </div>
                        <div className="booking-card-row">
                            <span>Cleaning fee</span>
                            <span>${CLEANING_FEE}</span>
                        </div>
                        <div className="booking-card-row">
                            <span>Service fee</span>
                            <span>${SERVICE_FEE}</span>
                        </div>
                        <div className="booking-card-row">
                            <span>Occupancy taxes and fees</span>
                            <span>${OCCUPANCY_FEE}</span>
                        </div>

                        <hr className="booking-card-divider" />

                        <div className="booking-card-row booking-card-total">
                            <span>Total</span>
                            <span>${nights > 0 ? total : 0}</span>
                        </div>
                    </div>
                </div>

                
            </div>
            <div className='review-section'>
                    <div>
                        <div className='img-name-date'>
                            <img src='/assets/1.jpg' />
                            <div>
                                <h4>Alice</h4>
                                <p>March 2023</p>
                            </div>
                            
                        </div>
                        <div className='review-desription'>
                            <p>Amazing place, very clean and well located</p>
                        </div>
                        <div className='img-name-date'>
                            <img src='/assets/2.jpg' />
                            <div>
                                <h4>Bob</h4>
                                <p>February 2023</p>
                            </div>
                        </div>
                        <div className='review-desription'>
                            <p>Great communication with the host and easy check-in process</p>
                        </div>
                        <div className='img-name-date'>
                            <img src='/assets/3.jpg' />
                            <div>
                                <h4>Carol</h4>
                                <p>January 2023</p>
                            </div>                            
                        </div>
                        <div className='review-desription'>
                            <p>The apartment was exactly as described. Highly reccomend.</p>
                        </div>
                    </div>

                    <div>
                        <div className='img-name-date'>
                            <img src='/assets/4.jpg' />
                            <div>
                                <h4>Dave</h4>
                                <p>December 2022</p>
                            </div>
                        </div>
                        <div className='review-desription'>
                            <p>Fantastic stay! The location is perfect.</p>
                        </div>
                        <div className='img-name-date'>
                            <img src='/assets/1.jpg' />
                            <div>
                                <h4>Eve</h4>
                                <p>November 2023</p>
                            </div>                           
                        </div>
                        <div className='review-desription'>
                            <p>Very clean and spacious. Would definitely come back.</p>
                        </div>
                        <div className='img-name-date'>
                            <img src='/assets/5.jpg' />
                            <div>
                                <h4>Frank</h4>
                                <p>January 2023</p>
                            </div>         
                        </div>
                        <div className='review-desription'>
                            <p>The apartment was exactly as described. Highly reccomend.</p>
                        </div>
                    </div>
                    
            </div>
            <button className='review-section-button'>Show all 12 reviews</button>
            <hr className="listing-detail-divider" />

            <div className='hosted-by-section'>
                <div className='img-name-date'>
                            <img src='/assets/4.jpg' />
                            <div>
                                <h4>Hosted by Johan</h4>
                                <p>Joined June 2022</p>
                            </div>
                </div>
                <div className='host-description'>
                    <span>320 Reviews</span>
                    <span>Identity verified</span>
                    <span>Superhost</span>
                </div>

                <p>Superhosts are experienced, highly rated hosts who are commited to providing great stays for guests.</p>
                <p>Response rate: 100%</p>
                <p>Response time: within an hour</p>

                <button>Contact Host</button>

                <p>To protect your payment, never transfer money or communicate outside of the Airbnb website or app.</p>

            </div>

            <hr className="listing-detail-divider" />

            <div className='listing-detail-footer'>
                <div>
                    <h2>House rules</h2>
                    <p>Check-in: After 4:00 PM</p>
                    <p>Check-out: 10:00 AM</p>
                    <p>Self check-in with lock-box</p>
                    <p>Not suitable for infants (under 2 years)</p>
                    <p>No smoking</p>
                    <p>No pets</p>
                    <p>No parties or events</p>
                </div>

                <div>
                    <h2>Health & Safety</h2>
                    <p>Commited to Airbnb's enhanced cleaning process</p>
                    <Link>Show more</Link>
                    <p>Airbnb's social-distancing and other Covid-19-related guidelines apply</p>
                    <p>Carbon monoxide alarm</p>
                    <p>Smoke alarm</p>
                    <p>Security Deposit - if you damage the home, you may be charged up to $599</p>
                    <Link>Show more</Link>
                </div>

                <div>
                    <h2>Cancellation policy</h2>
                    <p>Free cancellation before February 14</p>
                    <Link>Show more</Link>
                </div>
            </div>
        </div>
    )
}

export default ListingDetail
