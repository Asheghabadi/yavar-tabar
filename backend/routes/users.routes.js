const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

// All these routes are protected
router.use(protect);

// Route for updating location
router.put('/location', userController.updateUserLocation);

// Route for finding nearby vendors
router.get('/nearby/vendors', userController.findNearbyVendors);

// Routes for /api/users
router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

// Routes for /api/users/:id
router.route('/:id')
    .get(userController.getUserById)
    .put(userController.updateUser)
    .delete(userController.deleteUser);
// router.post('/', userController.createUser);


module.exports = router;
