import './SearchBar.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { API_URL } from '../config'

const SearchBar = () => {
    const navigate = useNavigate()
    const [location, setLocation] = useState('all')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [locations, setLocations] = useState([])

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch(`${API_URL}/api/listings`)
                if (!response.ok) return

                const data = await response.json()
                const uniqueLocations = [...new Set(data.map((listing) => listing.title))]
                setLocations(uniqueLocations.sort())
            } catch {
                setLocations([])
            }
        }

        fetchLocations()
    }, [])

    const handleSearch = () => {
        const params = new URLSearchParams()

        if (location !== 'all') {
            params.set('location', location)
        }

        if (startDate) {
            params.set('startDate', startDate)
        }

        if (endDate) {
            params.set('endDate', endDate)
        }

        const query = params.toString()
        navigate(query ? `/all-listings?${query}` : '/all-listings')
    }

    return (
        <div className="search-bar">
            <div className="search-bar-section search-bar-location">
                <label htmlFor="location-select">Location</label>
                <select
                    id="location-select"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                >
                    <option value="all">All Listings</option>
                    {locations.map((city) => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
            </div>

            <div className="search-bar-divider" />

            <div className="search-bar-section search-bar-dates">
                <label htmlFor="start-date">Check in</label>
                <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>

            <div className="search-bar-divider" />

            <div className="search-bar-section search-bar-dates">
                <label htmlFor="end-date">Check out</label>
                <input
                    id="end-date"
                    type="date"
                    value={endDate}
                    min={startDate || undefined}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>

            <button type="button" className="search-bar-button" onClick={handleSearch} aria-label="Search">
                <FaSearch />
            </button>
        </div>
    )
}

export default SearchBar
