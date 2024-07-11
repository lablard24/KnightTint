/*import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import { scheduleRouter } from './routes/schedule.js';
import { userRouter } from './routes/users.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use("/auth", userRouter);
app.use("/api", scheduleRouter);

mongoose.connect("mongodb+srv://lucknerablard:Bo8iNmAaD0CCTQ3S@knighttint.j9alfru.mongodb.net/knighttint?retryWrites=true&w=majority");
try {
    console.log('Connected to MongoDB');

}catch(error) {
    console.error('Error connecting to MongoDB:', error);
}


app.listen(3001, () => console.log("SERVER STARTED!"));*/


/*
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

import { scheduleRouter } from './routes/schedule.js';
import { userRouter } from './routes/users.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use("/auth", userRouter);
app.use("/api", scheduleRouter);

const mongoDbUrl = process.env.MONGO_DB_CONN_STRING;

mongoose.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});*/



// Remove useNewUrlParser and useUnifiedTopology options

import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import WebSocket from 'ws';

import { conditionRouter } from './src/routes/conditionRouter.js';
import { scheduleRouter } from './src/routes/schedule.js';
import { userRouter } from './src/routes/users.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Root path handler
app.get('/', (req, res) => {
  res.send('Welcome to KnightTint'); 
});

app.use("/auth", userRouter);
app.use("/api", scheduleRouter);
app.use(conditionRouter);

const mongoDbUrl = process.env.MONGO_DB_CONN_STRING;

mongoose.connect(mongoDbUrl); 
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// WebSocket setup
const ws = new WebSocket.Server({ port: 8080 });
let clients = [];

ws.on('connection', (socket) => {
  clients.push(socket);
  socket.on('close', () => {
    clients = clients.filter((client) => client !== socket);
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { clients }; // Export the clients array to use in schedule.js
