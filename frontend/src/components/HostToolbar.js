import { Link } from 'react-router-dom'
import './HostToolbar.css'

const HostToolbar = () => {
    return (
        <div className="host-toolbar">
            <Link to="/my-reservations" className="host-toolbar-link">
                View Reservations
            </Link>
            <Link to="/my-listings" className="host-toolbar-link">
                View Listings
            </Link>
            <Link to="/create-listing" className="host-toolbar-link host-toolbar-link-primary">
                Create Listing
            </Link>
        </div>
    )
}

export default HostToolbar
