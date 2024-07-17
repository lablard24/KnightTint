import mongoose from 'mongoose';

const ConditionSchema = new mongoose.Schema({
  windowNumber: { type: Number, required: true },
  type: { type: String, required: true },
  temperatureValue: { type: Number },
  luxValue: { type: Number },
  tintLevel: { type: Number, required: true }
}, { timestamps: true });

export const ConditionModel = mongoose.model("conditions", ConditionSchema);