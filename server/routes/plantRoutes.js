const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getPlants,
  getPlant,
  addPlant,
  updatePlant,
  deletePlant,
  getPlantStats,
} = require('../controllers/plantController');
const { protect } = require('../middleware/authMiddleware');

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Images only!');
    }
  },
});

router.route('/')
  .get(protect, getPlants)
  .post(protect, upload.single('image'), addPlant);

router.route('/stats')
  .get(protect, getPlantStats);

router.route('/:id')
  .get(protect, getPlant)
  .put(protect, upload.single('image'), updatePlant)
  .delete(protect, deletePlant);

module.exports = router;
