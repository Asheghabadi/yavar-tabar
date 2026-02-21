const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, updateOrder } = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');

// All order routes are protected
router.use(protect);

// @route   POST api/orders
// @route   GET api/orders
router.route('/')
    .post(createOrder)
    .get(getAllOrders);

// @route   PUT api/orders/:id
router.route('/:id')
    .put(updateOrder);

module.exports = router;