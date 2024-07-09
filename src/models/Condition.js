import mongoose from "mongoose";

const ConditionSchema = new mongoose.Schema({
    windowNumber: Number, 
    type: String,
    temperatureValue: Number,
    luxValue: Number,
    value: Number,
    tintLevel: Number,
  });
  
  export const ConditionModel = mongoose.model('Condition', ConditionSchema);
  