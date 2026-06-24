const sequelize = require('./config/db');
const { User, Unit, Question, Progress, UserAnswer, Flashcard } = require('./src/models');

async function syncDB() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');
        
        // Sync all models
        await sequelize.sync({ alter: true });
        console.log('✅ Database synced successfully');
        
        // Count tables for verification
        const userCount = await User.count();
        console.log(`📊 Users: ${userCount}`);
        
        const unitCount = await Unit.count();
        console.log(`📊 Units: ${unitCount}`);
        
        const questionCount = await Question.count();
        console.log(`📊 Questions: ${questionCount}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error syncing database:', error);
        process.exit(1);
    }
}

syncDB();