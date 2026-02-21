const express = require('express');
const router = express.Router();
const partController = require('../controllers/part.controller');
const { protect } = require('../middleware/auth.middleware');

// All these routes are protected
router.use(protect);

// Routes for /api/parts
router.route('/')
    .get(partController.getAllParts)
    .post(partController.createPart);

// Routes for /api/parts/:id
router.route('/:id')
    .get(partController.getPartById)
    .put(partController.updatePart)
    .delete(partController.deletePart);

module.exports = router;
