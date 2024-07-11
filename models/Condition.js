import mongoose from 'mongoose';

const conditionSchema = new mongoose.Schema({
  windowNumber: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['temperature', 'lux']
  },
  temperatureValue: {
    type: Number,
    required: function() { return this.type === 'temperature'; }
  },
  luxValue: {
    type: Number,
    required: function() { return this.type === 'lux'; }
  },
  tintLevel: {
    type: Number,
    required: true
  }
});

const ConditionModel = mongoose.model('Condition', conditionSchema);

export { ConditionModel };
