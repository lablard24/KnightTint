import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({
  windowNumber: { type: Number, required: true },
  hour: { type: Number, required: true },
  minute: { type: Number, required: true },
  days: { type: [Number], required: true }, // Array of integers representing days (0 for Sunday, 6 for Saturday)
  tintLevel: { type: Number, required: true },
});

export const ScheduleModel = mongoose.model("schedule", ScheduleSchema);