const User = require('../models/user.model');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}); // Find all users
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error });
    }
};

const createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error: error });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error });
    }
};

const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error: error });
    }
};

const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error });
    }
};

// @desc    Update user's location
// @route   PUT /api/users/location
// @access  Private
const updateUserLocation = async (req, res) => {
    const { longitude, latitude } = req.body;

    if (longitude === undefined || latitude === undefined) {
        return res.status(400).json({ message: 'Longitude and latitude are required' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.location = {
            type: 'Point',
            coordinates: [longitude, latitude]
        };

        await user.save();
        res.json(user.location.coordinates);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// @desc    Find nearby vendors
// @route   GET /api/users/nearby/vendors
// @access  Private
const findNearbyVendors = async (req, res) => {
    const { longitude, latitude, radius } = req.query;

    if (!longitude || !latitude || !radius) {
        return res.status(400).json({ message: 'Longitude, latitude, and radius are required' });
    }

    // Radius in meters
    const radiusInMeters = radius * 1000;

    try {
        const vendors = await User.find({
            role: 'vendor',
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: radiusInMeters
                }
            }
        }).select('-password'); // Exclude password from the result

        res.json(vendors);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

module.exports = { getAllUsers, createUser, getUserById, updateUser, deleteUser, updateUserLocation, findNearbyVendors };
