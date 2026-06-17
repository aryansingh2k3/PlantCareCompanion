const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzePlant } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/temp/' });

router.post('/analyze', protect, upload.single('image'), analyzePlant);

module.exports = router;
