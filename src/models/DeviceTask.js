import mongoose from 'mongoose';

const DeviceTaskSchema = new mongoose.Schema({
    deviceId: { 
        type: String, 
        required: true 
    },

    taskType: { 
        type: String, 
        required: true 
    },

    taskDetails: { 
        type: mongoose.Schema.Types.Mixed, 
        required: true 
    },

    scheduledTime: { 
        type: Date, 
        required: false 
    },

    createdAt: {
         type: Date, 
         default: Date.now 
    }
});

const DeviceTaskModel = mongoose.model('DeviceTask', DeviceTaskSchema);

export { DeviceTaskModel };
