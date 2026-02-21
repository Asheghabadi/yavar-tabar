const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    const { name, phone, password, role } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ phone });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({
            name,
            phone,
            password,
            role
        });

        await user.save();

        // Return token
            const payload = { userId: user.id, role: user.role, name: user.name };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Replace 'your_jwt_secret' with an environment variable

        res.status(201).json({ token });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { phone, password } = req.body;

    try {
        // Check for user
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const payload = { userId: user.id };
        const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' }); // Replace 'your_jwt_secret' with an environment variable

        res.json({ token });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
    register,
    login
};