import express from 'express';
import cron from 'node-cron';
import WebSocket from 'ws';
import { clients } from '../index.js';
import { ScheduleModel } from '../models/Schedule.js';

const router = express.Router();

// Get all conditions for a specific window
router.get('/schedules/:windowNumber', async (req, res) => {
  try {
    const conditions = await ScheduleModel.find({ windowNumber: req.params.windowNumber });
    res.json(conditions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new condition
router.post('/schedules', async (req, res) => {
  const { windowNumber, hour, minute, days, tintLevel } = req.body;

  const newSchedule = new ScheduleModel({
    windowNumber,
    hour,
    minute,
    days,
    tintLevel,
  });

  try {
    const savedCondition = await newSchedule.save();
    res.json(savedCondition);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing condition
router.put('/schedules/:id', async (req, res) => {
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
router.delete('/schedules/:id', async (req, res) => {
  try {
    await ScheduleModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Condition deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Function to send the tint level to all connected WebSocket clients
const sendTintLevelToClients = (windowNumber, tintLevel) => {
  const message = JSON.stringify({ window: windowNumber, action: 'set', value: tintLevel });
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      console.log(`Sending to client: ${message}`);
      client.send(message);
    }
  });
};

// Scheduler to check and apply conditions every minute
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentDay = now.getDay(); // Sunday is 0, Monday is 1, and so on

  console.log(`Running CRON job at ${currentHour}:${currentMinute} on day ${currentDay}`);

  try {
    const conditions = await ScheduleModel.find({
      hour: currentHour,
      minute: currentMinute,
      days: currentDay,
    });

    console.log(`Conditions found: ${conditions.length}`);

    conditions.forEach((condition) => {
      console.log(`Condition met: ${JSON.stringify(condition)}`);
      sendTintLevelToClients(condition.windowNumber, condition.tintLevel);
    });
  } catch (error) {
    console.error('Error checking conditions:', error);
  }
});

export { router as scheduleRouter };

