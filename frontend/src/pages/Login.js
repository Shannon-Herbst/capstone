import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { API_URL } from '../config'

function Login() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const redirectTo = searchParams.get('redirect') || '/'
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Login failed')
            }

            localStorage.setItem('token', data.token)
            localStorage.setItem('username', data.username)
            navigate(redirectTo)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='d-flex justify-content-center align-items-center bg-secondary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h2>Login</h2>

                {error && <p className='text-danger'>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='username'>
                            <strong>Username</strong>
                        </label>
                        <input
                            id='username'
                            type='text'
                            placeholder='Enter Username'
                            name='username'
                            className='form-control rounded-0'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'>
                            <strong>Password</strong>
                        </label>
                        <input
                            id='password'
                            type='password'
                            placeholder='Enter Password'
                            name='password'
                            className='form-control rounded-0'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type='submit'
                        className='btn btn-success w-100 rounded-0'
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className='mt-3 mb-2'>Don't have an account?</p>
                <Link to='/sign-up' className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>
                    Sign Up
                </Link>
            </div>
        </div>
    )
}

export default Login
