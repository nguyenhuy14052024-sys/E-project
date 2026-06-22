require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const sequelize = require('./config/db');
// const redisClient = require('./config/redis');

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

app.use('/api/auth', authRoutes);
app.use('/api/units', unitRoutes);
const quizRoutes = require('./src/routes/quizRoutes'); // Thêm dòng này
app.use('/api/quizzes', quizRoutes); // Thêm dòng này
// Test kết nối Database
(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL connected successfully');
        
        // Sync database (tạo bảng nếu chưa có)
        await sequelize.sync({ alter: true });
        console.log('✅ Database synced');
    } catch (error) {
        console.error('❌ PostgreSQL connection error:', error);
    }
})();

// Test kết nối Redis
// Test kết nối Redis
// (async () => {
//     try {
//         await redisClient.set('test', 'OK');
//         const test = await redisClient.get('test');
//         if (test === 'OK') {
//             console.log('✅ Redis connected successfully');
//         }
//     } catch (error) {
//         console.error('❌ Redis connection error:', error);
//     }
// })();

// Routes (sẽ thêm sau)
app.get('/', (req, res) => {
    res.json({ message: '🚀 English B2-C1 API is running!' });
});

// Error handling middleware
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