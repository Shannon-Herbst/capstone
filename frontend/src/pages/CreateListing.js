import './EditListing.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'

const initialForm = {
    accommodationType: '',
    title: '',
    location: '',
    description: '',
    maxGuests: '',
    bedrooms: '',
    bathrooms: '',
    amenities: '',
    images: '',
    price: '',
    enhancedCleaning: false,
    selfCheckIn: false
}

function CreateListing() {
    const navigate = useNavigate()
    const [form, setForm] = useState(initialForm)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (!token) {
            navigate('/login?redirect=/create-listing')
        }
    }, [navigate])

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const buildAmenities = () => {
        const amenities = form.amenities
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)

        if (form.enhancedCleaning) {
            amenities.push('Enhanced Cleaning')
        }

        if (form.selfCheckIn) {
            amenities.push('Self Check-in')
        }

        return amenities
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const token = localStorage.getItem('token')

        if (!token) {
            navigate('/login?redirect=/create-listing')
            return
        }

        const amenities = buildAmenities()
        const images = form.images
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)

        if (amenities.length === 0) {
            setError('Please add at least one amenity.')
            return
        }

        if (images.length === 0) {
            setError('Please add at least one image URL.')
            return
        }

        setSaving(true)
        setError('')

        try {
            const response = await fetch(`${API_URL}/api/listings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    accommodationType: form.accommodationType,
                    title: form.title,
                    location: form.location,
                    description: form.description,
                    maxGuests: Number(form.maxGuests),
                    bedrooms: Number(form.bedrooms),
                    bathrooms: Number(form.bathrooms),
                    amenities,
                    images,
                    price: Number(form.price),
                    rating: 0,
                    reviewCount: 0
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create listing')
            }

            navigate('/my-listings')
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="edit-listing">
            <h1>Create Listing</h1>

            {error && <p className="edit-listing-error">{error}</p>}

            <form className="edit-listing-form" onSubmit={handleSubmit}>
                <label>
                    Accommodation type
                    <input
                        name="accommodationType"
                        value={form.accommodationType}
                        onChange={handleChange}
                        placeholder="Entire apartment"
                        required
                    />
                </label>

                <label>
                    Listing title
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Location
                    <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Description
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Max guests
                    <input
                        name="maxGuests"
                        type="number"
                        min="1"
                        value={form.maxGuests}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Bedrooms
                    <input
                        name="bedrooms"
                        type="number"
                        min="0"
                        value={form.bedrooms}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Bathrooms
                    <input
                        name="bathrooms"
                        type="number"
                        min="0"
                        value={form.bathrooms}
                        onChange={handleChange}
                        required
                    />
                </label>

                <div className="create-listing-checkboxes">
                    <label className="create-listing-checkbox">
                        <input
                            type="checkbox"
                            name="enhancedCleaning"
                            checked={form.enhancedCleaning}
                            onChange={handleChange}
                        />
                        Enhanced Cleaning
                    </label>

                    <label className="create-listing-checkbox">
                        <input
                            type="checkbox"
                            name="selfCheckIn"
                            checked={form.selfCheckIn}
                            onChange={handleChange}
                        />
                        Self Check-in
                    </label>
                </div>

                <label>
                    Amenities (comma separated)
                    <input
                        name="amenities"
                        value={form.amenities}
                        onChange={handleChange}
                        placeholder="WiFi, Kitchen, Washer"
                        required
                    />
                </label>

                <label>
                    Image URLs (comma separated)
                    <input
                        name="images"
                        value={form.images}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        required
                    />
                </label>

                <label>
                    Price per night
                    <input
                        name="price"
                        type="number"
                        min="1"
                        value={form.price}
                        onChange={handleChange}
                        required
                    />
                </label>

                <div className="edit-listing-actions">
                    <button type="button" onClick={() => navigate('/my-listings')}>
                        Cancel
                    </button>
                    <button type="submit" disabled={saving}>
                        {saving ? 'Creating...' : 'Create listing'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateListing
