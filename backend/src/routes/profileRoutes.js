const express = require('express');
const router = express.Router();
const { getProfile, getCertificates, createCertificate } = require('../controllers/profileController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, getProfile);
router.get('/certificates', authMiddleware, getCertificates);
router.post('/certificates', authMiddleware, createCertificate);

module.exports = router;