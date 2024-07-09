import mongoose from 'mongoose';

const conditionSchema = new mongoose.Schema({
  windowNumber: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['temperature', 'lux', 'both']
  },
  temperatureValue: {
    type: Number,
    required: function() { return this.type === 'temperature' || this.type === 'both'; }
  },
  luxValue: {
    type: Number,
    required: function() { return this.type === 'lux' || this.type === 'both'; }
  },
  value: {
    type: Number,
    required: function() { return this.type !== 'both'; }
  },
  tintLevel: {
    type: Number,
    required: true
  }
});

const ConditionModel = mongoose.model('Condition', conditionSchema);

export { ConditionModel };
