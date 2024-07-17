import express from 'express';
import { ConditionModel } from '../models/Condition.js';

const router = express.Router();

// Get all conditions for a specific window
router.get('/:windowNumber', async (req, res) => {
  try {
    const conditions = await ConditionModel.find({ windowNumber: req.params.windowNumber });
    res.json(conditions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new condition
router.post('/', async (req, res) => {
  const { windowNumber, type, temperatureValue, luxValue, tintLevel } = req.body;
  const newCondition = new ConditionModel({
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
    const updatedCondition = await ConditionModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
  console.log('DELETE request received');
  try {
    const deletedCondition = await ConditionModel.findByIdAndDelete(req.params.id);
    if (!deletedCondition) {
      console.log('Condition not found');
      return res.status(404).json({ message: 'Condition not found' });
    }
    res.json({ message: 'Condition deleted' });
  } catch (error) {
    console.error('Error deleting condition:', error);
    res.status(500).json({ message: error.message });
  }
});

/*
// Delete a condition by window number and ID
router.delete('/:windowNumber/:id', async (req, res) => {
  try {
    const { windowNumber, id } = req.params;
    console.log(`Attempting to delete condition with windowNumber: ${windowNumber} and id: ${id}`);
    
    const deletedCondition = await Condition.findOneAndDelete({ windowNumber, _id: id });
    
    if (!deletedCondition) {
      console.log('Condition not found');
      return res.status(404).json({ message: 'Condition not found' });
    }
    
    console.log('Condition deleted:', deletedCondition);
    res.json({ message: 'Condition deleted' });
  } catch (error) {
    console.error('Error deleting condition:', error);
    res.status(500).json({ message: error.message });
  }
});*/





export { router as conditionRouter };

