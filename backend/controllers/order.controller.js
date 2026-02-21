const Order = require('../models/order.model');
const Part = require('../models/part.model');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Driver)
const createOrder = async (req, res) => {
    const { partId, quantity } = req.body;
    const driverId = req.user.id; // From auth middleware

    try {
        // Check if the part exists
        const part = await Part.findById(partId);
        if (!part) {
            return res.status(404).json({ message: 'Part not found' });
        }

        // Ensure the user creating the order is a driver
        if (req.user.role !== 'driver') {
            return res.status(403).json({ message: 'Only drivers can create orders' });
        }

        const order = new Order({
            part: partId,
            quantity,
            driver: driverId,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (All authenticated users)
const getAllOrders = async (req, res) => {
    try {
        // Depending on the user role, we can filter orders
        let orders;
        if (req.user.role === 'driver') {
            // Drivers see their own orders
            orders = await Order.find({ driver: req.user.id }).populate('part').populate('vendor', 'name');
        } else if (req.user.role === 'vendor') {
            // Vendors see pending orders and orders they have accepted
            orders = await Order.find({ $or: [{ status: 'pending' }, { vendor: req.user.id }] })
                .populate('part')
                .populate('driver', 'name phone');
        } else {
            // For any other role (e.g., an admin in the future), show all orders
            orders = await Order.find().populate('part').populate('driver', 'name').populate('vendor', 'name');
        }

        res.json(orders);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// @desc    Update an order (e.g., accept or complete)
// @route   PUT /api/orders/:id
// @access  Private (Vendor/Driver)
const updateOrder = async (req, res) => {
    const { status } = req.body;
    const orderId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Scenario 1: Vendor accepts a pending order
        if (order.status === 'pending' && status === 'accepted' && userRole === 'vendor') {
            order.vendor = userId;
            order.status = 'accepted';
        } 
        // Scenario 2: Driver or assigned Vendor completes an accepted order
        else if (order.status === 'accepted' && status === 'completed') {
            // Check if the user is either the driver or the assigned vendor
            if (order.driver.toString() === userId || order.vendor.toString() === userId) {
                order.status = 'completed';
            } else {
                return res.status(403).json({ message: 'Not authorized to update this order' });
            }
        } 
        // Add other status transitions here if needed (e.g., cancelling)
        else {
            return res.status(400).json({ message: `Invalid status transition or insufficient permissions` });
        }

        const updatedOrder = await order.save();
        // Populate the fields to return the full object to the frontend
        await updatedOrder.populate('part driver vendor');
        res.json(updatedOrder);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

module.exports = { createOrder, getAllOrders, updateOrder };