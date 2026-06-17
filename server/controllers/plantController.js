const Plant = require('../models/Plant');

// @desc    Get all plants for logged in user
// @route   GET /api/plants
// @access  Private
const getPlants = async (req, res) => {
  const plants = await Plant.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(plants);
};

// @desc    Get single plant
// @route   GET /api/plants/:id
// @access  Private
const getPlant = async (req, res) => {
  const plant = await Plant.findById(req.params.id);

  if (!plant) {
    res.status(404);
    throw new Error('Plant not found');
  }

  if (plant.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  res.status(200).json(plant);
};

// @desc    Add a new plant
// @route   POST /api/plants
// @access  Private
const addPlant = async (req, res) => {
  const { plantName, species, wateringFrequency, sunlightRequirement, notes } = req.body;

  if (!plantName || !species || !wateringFrequency) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  const plant = await Plant.create({
    user: req.user.id,
    plantName,
    species,
    image: req.file ? `/uploads/${req.file.filename}` : 'default-plant.jpg',
    wateringFrequency: Number(wateringFrequency),
    sunlightRequirement,
    notes,
  });

  res.status(201).json(plant);
};

// @desc    Update a plant
// @route   PUT /api/plants/:id
// @access  Private
const updatePlant = async (req, res) => {
  const plant = await Plant.findById(req.params.id);

  if (!plant) {
    res.status(404);
    throw new Error('Plant not found');
  }

  // Check for user
  if (plant.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedData = { ...req.body };
  if (req.file) {
    updatedData.image = `/uploads/${req.file.filename}`;
  }

  const updatedPlant = await Plant.findByIdAndUpdate(req.params.id, updatedData, {
    new: true,
  });

  res.status(200).json(updatedPlant);
};

// @desc    Delete a plant
// @route   DELETE /api/plants/:id
// @access  Private
const deletePlant = async (req, res) => {
  const plant = await Plant.findById(req.params.id);

  if (!plant) {
    res.status(404);
    throw new Error('Plant not found');
  }

  if (plant.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await plant.deleteOne();

  res.status(200).json({ id: req.params.id });
};

// @desc    Get plant statistics
// @route   GET /api/plants/stats
// @access  Private
const getPlantStats = async (req, res) => {
  const total = await Plant.countDocuments({ user: req.user.id });
  const healthy = await Plant.countDocuments({ user: req.user.id, healthStatus: 'Healthy' });
  const sick = await Plant.countDocuments({ user: req.user.id, healthStatus: { $ne: 'Healthy' } });

  res.status(200).json({ total, healthy, sick });
};

module.exports = {
  getPlants,
  getPlant,
  addPlant,
  updatePlant,
  deletePlant,
  getPlantStats,
};
