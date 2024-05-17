import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { deviceTasksRouter } from './routes/deviceTasks.js';
//import { devicesRouter } from './routes/devices.js';
import { userRouter } from './routes/users.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', userRouter);
//app.use('/devices', devicesRouter);
app.use('/deviceTasks', deviceTasksRouter);

mongoose.connect('mongodb+srv://lucknerablard:Bo8iNmAaD0CCTQ3S@knighttint.j9alfru.mongodb.net/knighttint?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
  console.error('Error connecting to MongoDB:', error);
});

app.listen(3001, () => {
  console.log('SERVER STARTED on port 3001!');
});
