import express from 'express';
import { DeviceTaskModel } from '../models/DeviceTask.js';

const router = express.Router();

// Create a new task
router.post('/tasks', async (req, res) => {
    try {
        const { deviceId, taskType, taskDetails, scheduledTime } = req.body;

        const newTask = new DeviceTaskModel({
            deviceId,
            taskType,
            taskDetails,
            scheduledTime
        });

        await newTask.save();
        res.status(201).json({ message: 'Task created successfully!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get tasks for a device
router.get('/tasks/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params;
        const tasks = await DeviceTaskModel.find({ deviceId });
        res.status(200).json(tasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update a task
router.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTask = await DeviceTaskModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedTask);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete a task
router.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await DeviceTaskModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Task deleted successfully!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export { router as deviceTasksRouter };


