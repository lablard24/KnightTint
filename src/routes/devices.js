import express from 'express';

const router = express.Router();

router.get('/device-tasks', (req, res) => {
    const sensorData = req.query.sensorData;
    console.log(`Received sensor data: ${sensorData}`);
    res.send(`Data received: ${sensorData}`);
});

export { router as devicesRouter };
