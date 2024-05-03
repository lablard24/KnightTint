import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import { userRouter } from './routes/users.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);

mongoose.connect("mongodb+srv://lucknerablard:Bo8iNmAaD0CCTQ3S@knighttint.j9alfru.mongodb.net/knighttint?retryWrites=true&w=majority");
try {
    console.log('Connected to MongoDB');

}catch(error) {
    console.error('Error connecting to MongoDB:', error);
}


app.listen(3001, () => console.log("SERVER STARTED!"));


