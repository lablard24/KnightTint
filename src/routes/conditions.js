import express from 'express';
import Condition from '../models/Condition.js';

const router = express.Router();

// Get all conditions for a specific window
router.get('/:windowNumber', async (req, res) => {
  try {
    const conditions = await Condition.find({ windowNumber: req.params.windowNumber });
    res.json(conditions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new condition
router.post('/', async (req, res) => {
  const { windowNumber, type, temperatureValue, luxValue, tintLevel } = req.body;
  const newCondition = new Condition({
    windowNumber,
    type,
    temperatureValue,
    luxValue,
    tintLevel
  });

  try {
    const savedCondition = await newCondition.save();
    res.status(201).json(savedCondition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an existing condition
router.put('/:id', async (req, res) => {
  try {
    const updatedCondition = await Condition.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCondition) {
      return res.status(404).json({ message: 'Condition not found' });
    }
    res.json(updatedCondition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a condition
router.delete('/:id', async (req, res) => {
  try {
    const deletedCondition = await Condition.findByIdAndDelete(req.params.id);
    if (!deletedCondition) {
      return res.status(404).json({ message: 'Condition not found' });
    }
    res.json({ message: 'Condition deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
