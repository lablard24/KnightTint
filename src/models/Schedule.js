import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({
  windowNumber: {
    type: Number,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  tintLevel: {
    type: Number,
    required: true,
  },
  repeatDays: {
    type: [String],
    required: true,
  },
    
});

export const ScheduleModel = mongoose.model("schedule", ScheduleSchema);