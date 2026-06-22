const express = require('express');
const router = express.Router();
const { getUnits, getUnitById } = require('../controllers/unitController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Lấy danh sách Unit (có thể filter ?level=B2)
router.get('/', authMiddleware, getUnits);

// Lấy chi tiết 1 Unit
router.get('/:id', authMiddleware, getUnitById);

module.exports = router;