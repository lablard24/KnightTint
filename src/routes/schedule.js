import express from 'express';
import { ScheduleModel } from '../models/Schedule.js';

const router = express.Router();

/*
// Route to fetch schedules
router.get('/schedules', async (req, res) => {
  try {
    const { windowNumber } = req.query;
    const schedules = await ScheduleModel.find({ windowNumber });
    res.status(200).json({ status: 'success', schedules });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Route to add a new schedule
router.post('/schedule-tint', async (req, res) => {
  try {
    const { windowNumber, time, tintLevel, repeatDays } = req.body;
    const newSchedule = new ScheduleModel({ windowNumber, time, tintLevel, repeatDays });
    await newSchedule.save();
    res.status(201).json({ status: 'success', schedule: newSchedule });
  } catch (error) {
    console.error('Error adding schedule:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Route to delete a schedule
router.post('/delete-schedule', async (req, res) => {
  try {
    const { windowNumber, time, tintLevel } = req.body;
    const schedule = await ScheduleModel.findOneAndDelete({ windowNumber, time, tintLevel });
    if (schedule) {
      res.status(200).json({ status: 'success', message: 'Schedule deleted' });
    } else {
      res.status(404).json({ status: 'error', message: 'Schedule not found' });
    }
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Route to update a schedule
router.put('/update-schedule', async (req, res) => {
  try {
    const { id, windowNumber, time, tintLevel, repeatDays } = req.body;
    const updatedSchedule = await ScheduleModel.findByIdAndUpdate(
      id,
      { windowNumber, time, tintLevel, repeatDays },
      { new: true, runValidators: true }
    );
    if (updatedSchedule) {
      res.status(200).json({ status: 'success', schedule: updatedSchedule });
    } else {
      res.status(404).json({ status: 'error', message: 'Schedule not found' });
    }
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});
*/

// Get all conditions for a specific window
router.get('/conditions/:windowNumber', async (req, res) => {
  try {
    const conditions = await ScheduleModel.find({ windowNumber: req.params.windowNumber });
    res.json(conditions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new condition
router.post('/conditions', async (req, res) => {
  const { windowNumber, hour, minute, days, tintLevel } = req.body;

  const newCondition = new ScheduleModel({
    windowNumber,
    hour,
    minute,
    days,
    tintLevel,
  });

  try {
    const savedCondition = await newCondition.save();
    res.json(savedCondition);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing condition
router.put('/conditions/:id', async (req, res) => {
  const { windowNumber, hour, minute, days, tintLevel } = req.body;

  try {
    const updatedCondition = await ScheduleModel.findByIdAndUpdate(
      req.params.id,
      { windowNumber, hour, minute, days, tintLevel },
      { new: true }
    );
    res.json(updatedCondition);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a condition
router.delete('/conditions/:id', async (req, res) => {
  try {
    await ScheduleModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Condition deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { router as scheduleRouter };

