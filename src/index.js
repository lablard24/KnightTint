import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import { userRouter } from './routes/users.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);

//mongoose.connect("mongodb+srv://knighttintapp:Il8KpAIXW8wfVzi9@knighttintapp.yufhogo.mongodb.net/");

mongoose.connect("mongodb+srv://knighttintapp:Il8KpAIXW8wfVzi9@knighttintapp.yufhogo.mongodb.net/",
{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
}
);

app.listen(3001, () => console.log("SERVER STARTED!"));

