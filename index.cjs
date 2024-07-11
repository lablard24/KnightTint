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
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');
const express = require('express');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const cron = require('node-cron');
const jwt = require('jsonwebtoken');

const conditionRouter = require('./routes/conditionRouter');
const scheduleRouter = require('./routes/schedule');
const userRouter = require('./routes/users');

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

module.exports = { clients };