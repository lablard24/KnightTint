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
});