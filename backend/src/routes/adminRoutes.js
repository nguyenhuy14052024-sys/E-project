const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const {
    getAllUnits,
    createUnit,
    updateUnit,
    deleteUnit,
    getQuestionsByUnit,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getAllUsers,
    updateUser
} = require('../controllers/adminController');

// Tất cả route admin đều cần authMiddleware + isAdmin
router.use(authMiddleware);
router.use(isAdmin);

// ==================== QUẢN LÝ UNIT ====================
router.get('/units', getAllUnits);
router.post('/units', createUnit);
router.put('/units/:id', updateUnit);
router.delete('/units/:id', deleteUnit);

// ==================== QUẢN LÝ CÂU HỎI ====================
router.get('/units/:unitId/questions', getQuestionsByUnit);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

// ==================== QUẢN LÝ NGƯỜI DÙNG ====================
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);

module.exports = router;