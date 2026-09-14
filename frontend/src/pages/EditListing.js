import './EditListing.css'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_URL } from '../config'

const EditListing = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
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
        rating: '',
        reviewCount: ''
    })

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (!token) {
            navigate('/login?redirect=/my-listings')
            return
        }

        const fetchListing = async () => {
            try {
                const response = await fetch(`${API_URL}/api/listings/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to load listing')
                }

                setForm({
                    accommodationType: data.accommodationType,
                    title: data.title,
                    location: data.location,
                    description: data.description,
                    maxGuests: String(data.maxGuests),
                    bedrooms: String(data.bedrooms),
                    bathrooms: String(data.bathrooms),
                    amenities: data.amenities.join(', '),
                    images: data.images.join(', '),
                    price: String(data.price),
                    rating: String(data.rating),
                    reviewCount: String(data.reviewCount)
                })
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchListing()
    }, [id, navigate])

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const token = localStorage.getItem('token')

        if (!token) {
            navigate('/login?redirect=/my-listings')
            return
        }

        setSaving(true)
        setError('')

        try {
            const response = await fetch(`${API_URL}/api/listings/${id}`, {
                method: 'PATCH',
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
                    amenities: form.amenities.split(',').map((item) => item.trim()).filter(Boolean),
                    images: form.images.split(',').map((item) => item.trim()).filter(Boolean),
                    price: Number(form.price),
                    rating: Number(form.rating),
                    reviewCount: Number(form.reviewCount)
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update listing')
            }

            navigate('/my-listings')
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="edit-listing">
                <p className="edit-listing-loading">Loading...</p>
            </div>
        )
    }

    return (
        <div className="edit-listing">
            <h1>Update Listing</h1>

            {error && <p className="edit-listing-error">{error}</p>}

            <form className="edit-listing-form" onSubmit={handleSubmit}>
                <label>
                    Accommodation type
                    <input name="accommodationType" value={form.accommodationType} onChange={handleChange} required />
                </label>
                <label>
                    Title
                    <input name="title" value={form.title} onChange={handleChange} required />
                </label>
                <label>
                    Location
                    <input name="location" value={form.location} onChange={handleChange} required />
                </label>
                <label>
                    Description
                    <textarea name="description" value={form.description} onChange={handleChange} required />
                </label>
                <label>
                    Max guests
                    <input name="maxGuests" type="number" value={form.maxGuests} onChange={handleChange} required />
                </label>
                <label>
                    Bedrooms
                    <input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} required />
                </label>
                <label>
                    Bathrooms
                    <input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} required />
                </label>
                <label>
                    Amenities (comma separated)
                    <input name="amenities" value={form.amenities} onChange={handleChange} required />
                </label>
                <label>
                    Image URLs (comma separated)
                    <input name="images" value={form.images} onChange={handleChange} required />
                </label>
                <label>
                    Price per night
                    <input name="price" type="number" value={form.price} onChange={handleChange} required />
                </label>
                <label>
                    Rating
                    <input name="rating" type="number" step="0.1" value={form.rating} onChange={handleChange} required />
                </label>
                <label>
                    Review count
                    <input name="reviewCount" type="number" value={form.reviewCount} onChange={handleChange} required />
                </label>

                <div className="edit-listing-actions">
                    <button type="button" onClick={() => navigate('/my-listings')}>
                        Cancel
                    </button>
                    <button type="submit" disabled={saving}>
                        {saving ? 'Saving...' : 'Save changes'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditListing
