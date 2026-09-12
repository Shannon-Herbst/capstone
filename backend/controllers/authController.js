const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const getJwtSecret = () => process.env.JWT_SECRET || 'capstone-dev-secret'

const createToken = (userId) => {
    return jwt.sign(
        { _id: userId },
        getJwtSecret(),
        { expiresIn: '7d' }
    )
}

const registerUser = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' })
    }

    if (username.trim().length < 3) {
        return res.status(400).json({ error: 'Username must be at least 3 characters' })
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    try {
        const existingUser = await User.findOne({ username: username.trim() })

        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
            username: username.trim(),
            password: hashedPassword
        })

        const token = createToken(user._id)

        res.status(201).json({
            username: user.username,
            token
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const loginUser = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' })
    }

    try {
        const user = await User.findOne({ username: username.trim() })

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' })
        }

        const token = createToken(user._id)

        res.status(200).json({
            username: user.username,
            token
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    registerUser,
    loginUser
}
