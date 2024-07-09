import express from 'express';
import { ConditionModel } from '../models/Condition.js';

const router = express.Router();

// Add a new condition
router.post('/conditions', async (req, res) => {
  try {
    const { windowNumber, type, temperatureValue, luxValue, value, tintLevel } = req.body;
    const condition = new ConditionModel({ windowNumber, type, temperatureValue, luxValue, value, tintLevel });
    await condition.save();
    res.status(201).send(condition);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get conditions by window number
router.get('/conditions/:windowNumber', async (req, res) => {
  try {
    const conditions = await ConditionModel.find({ windowNumber: req.params.windowNumber });
    if (conditions.length === 0) {
      return res.status(200).json([]);
    }
    res.send(conditions);
  } catch (error) {
    res.status(500).send(error);
  }
});




// Update an existing condition by ID
router.put('/conditions/:id', async (req, res) => {
  try {
    const { windowNumber, type, temperatureValue, luxValue, value, tintLevel } = req.body;
    const condition = await ConditionModel.findByIdAndUpdate(req.params.id, 
      { windowNumber, type, temperatureValue, luxValue, value, tintLevel },
      { new: true, runValidators: true }
    );
    if (!condition) {
      return res.status(404).send();
    }
    res.send(condition);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a condition by ID
router.delete('/conditions/:id', async (req, res) => {
  try {
    const condition = await ConditionModel.findByIdAndDelete(req.params.id);
    if (!condition) {
      return res.status(404).send();
    }
    res.send(condition);
  } catch (error) {
    res.status(500).send(error);
  }
});

export { router as conditionRouter };
