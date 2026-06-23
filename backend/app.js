require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// const redisClient = require('./config/redis'); // Đã comment tạm
const sequelize = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./src/routes/authRoutes');
const unitRoutes = require('./src/routes/unitRoutes');
const quizRoutes = require('./src/routes/quizRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/quizzes', quizRoutes);

// Test kết nối Database
(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL connected successfully');
        
        await sequelize.sync({ alter: true });
        console.log('✅ Database synced');
    } catch (error) {
        console.error('❌ PostgreSQL connection error:', error);
    }
})();

// Route gốc
app.get('/', (req, res) => {
    res.json({ message: '🚀 English B2-C1 API is running!' });
});

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});