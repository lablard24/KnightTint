import express from 'express';
import { ScheduleModel } from '../models/Schedule.js';

const router = express.Router();

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

export { router as scheduleRouter };
