const mongoose = require('mongoose');

const reminderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Plant',
    },
    reminderDate: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ['Watering', 'Health Check', 'Fertilizing'],
      default: 'Watering',
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Dismissed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Reminder', reminderSchema);
