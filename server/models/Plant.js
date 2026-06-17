const mongoose = require('mongoose');

const plantSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    plantName: {
      type: String,
      required: [true, 'Please add a plant name'],
    },
    species: {
      type: String,
      required: [true, 'Please add a species'],
    },
    image: {
      type: String,
      default: 'default-plant.jpg',
    },
    wateringFrequency: {
      type: Number, // in days
      required: true,
    },
    lastWateredDate: {
      type: Date,
      default: Date.now,
    },
    nextWateringDate: {
      type: Date,
    },
    sunlightRequirement: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    healthStatus: {
      type: String,
      enum: ['Healthy', 'Struggling', 'Sick', 'Needs Attention'],
      default: 'Healthy',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to calculate next watering date before saving
plantSchema.pre('save', function (next) {
  if (this.isModified('wateringFrequency') || this.isModified('lastWateredDate')) {
    const nextDate = new Date(this.lastWateredDate);
    nextDate.setDate(nextDate.getDate() + this.wateringFrequency);
    this.nextWateringDate = nextDate;
  }
  next();
});

module.exports = mongoose.model('Plant', plantSchema);
