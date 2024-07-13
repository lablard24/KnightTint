import mongoose from 'mongoose';

const conditionSchema = new mongoose.Schema({
  windowNumber: { type: Number, required: true },
  type: { type: String, required: true },
  temperatureValue: { type: Number },
  luxValue: { type: Number },
  tintLevel: { type: Number, required: true }
}, { timestamps: true });

const Condition = mongoose.model('Condition', conditionSchema);

export default Condition;
