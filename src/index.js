import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { WebSocketServer } from 'ws'; // Correct import for ES module

import { conditionRouter } from './routes/conditions.js';
import { scheduleRouter } from './routes/schedule.js';
import { userRouter } from './routes/users.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Root path handler
app.get('/', (req, res) => {
  res.send('Welcome to KnightTint'); 
});

app.use("/auth", userRouter);
app.use(scheduleRouter);
app.use('/conditions', conditionRouter);

const mongoDbUrl = process.env.MONGO_DB_CONN_STRING;

mongoose.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// WebSocket setup
const wsServer = new WebSocketServer({ port: 8080 });
let clients = [];

wsServer.on('connection', (socket) => {
  clients.push(socket);
  socket.on('close', () => {
    clients = clients.filter((client) => client !== socket);
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { clients };

