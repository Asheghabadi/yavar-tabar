const Part = require('../models/part.model');

const getAllParts = async (req, res) => {
    try {
        const parts = await Part.find({}); // Find all parts
        res.json(parts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching parts', error: error });
    }
};

const createPart = async (req, res) => {
    try {
        const newPart = new Part(req.body);
        const savedPart = await newPart.save();
        res.status(201).json(savedPart);
    } catch (error) {
        res.status(400).json({ message: 'Error creating part', error: error });
    }
};

const getPartById = async (req, res) => {
    try {
        const part = await Part.findById(req.params.id);
        if (!part) return res.status(404).json({ message: 'Part not found' });
        res.json(part);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching part', error: error });
    }
};

const updatePart = async (req, res) => {
    try {
        const updatedPart = await Part.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPart) return res.status(404).json({ message: 'Part not found' });
        res.json(updatedPart);
    } catch (error) {
        res.status(400).json({ message: 'Error updating part', error: error });
    }
};

const deletePart = async (req, res) => {
    try {
        const deletedPart = await Part.findByIdAndDelete(req.params.id);
        if (!deletedPart) return res.status(404).json({ message: 'Part not found' });
        res.json({ message: 'Part deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting part', error: error });
    }
};

module.exports = {
    getAllParts,
    createPart,
    getPartById,
    updatePart,
    deletePart
};
