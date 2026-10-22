const UserProfile = require('./UserProfile');
const Feedback = require('./Feedback');
const User = require('./User');
const Unit = require('./Unit');
const Question = require('./Question');
const Progress = require('./Progress');
const UserAnswer = require('./UserAnswer');
const Flashcard = require('./Flashcard');
const Dictionary = require('./Dictionary');
const Certificate = require('./Certificate');
const LevelTest = require('./LevelTest');
const ReadingPassage = require('./ReadingPassage');
const LevelTestQuestion = require('./LevelTestQuestion');
const LevelTestAttempt = require('./LevelTestAttempt');

// ==================== QUAN HỆ CŨ ====================

// User - Progress (1-n)
User.hasMany(Progress, { foreignKey: 'user_id' });
Progress.belongsTo(User, { foreignKey: 'user_id' });

// Unit - Progress (1-n)
Unit.hasMany(Progress, { foreignKey: 'unit_id' });
Progress.belongsTo(Unit, { foreignKey: 'unit_id' });

// Unit - Question (1-n)
Unit.hasMany(Question, { foreignKey: 'unit_id' });
Question.belongsTo(Unit, { foreignKey: 'unit_id' });

// User - UserAnswer (1-n)
User.hasMany(UserAnswer, { foreignKey: 'user_id' });
UserAnswer.belongsTo(User, { foreignKey: 'user_id' });

// Question - UserAnswer (1-n)
Question.hasMany(UserAnswer, { foreignKey: 'question_id' });
UserAnswer.belongsTo(Question, { foreignKey: 'question_id' });

// User - Flashcard (1-n)
User.hasMany(Flashcard, { foreignKey: 'user_id' });
Flashcard.belongsTo(User, { foreignKey: 'user_id' });

// Unit - Flashcard (1-n)
Unit.hasMany(Flashcard, { foreignKey: 'unit_id' });
Flashcard.belongsTo(Unit, { foreignKey: 'unit_id' });

// User - Certificate (1-n)
User.hasMany(Certificate, { foreignKey: 'user_id' });
Certificate.belongsTo(User, { foreignKey: 'user_id' });

// Unit - Certificate (1-n)
Unit.hasMany(Certificate, { foreignKey: 'unit_id' });
Certificate.belongsTo(Unit, { foreignKey: 'unit_id' });

// ==================== QUAN HỆ LEVEL TEST ====================

// LevelTest - LevelTestQuestion (1-n)
LevelTest.hasMany(LevelTestQuestion, { foreignKey: 'level_test_id', as: 'questions' });
LevelTestQuestion.belongsTo(LevelTest, { foreignKey: 'level_test_id' });

// LevelTest - ReadingPassage (1-n)
LevelTest.hasMany(ReadingPassage, { foreignKey: 'level_test_id', as: 'passages' });
ReadingPassage.belongsTo(LevelTest, { foreignKey: 'level_test_id' });

// ReadingPassage - LevelTestQuestion (1-n)
ReadingPassage.hasMany(LevelTestQuestion, { foreignKey: 'passage_id', as: 'questions' });
LevelTestQuestion.belongsTo(ReadingPassage, { foreignKey: 'passage_id' });

// User - LevelTestAttempt (1-n)
User.hasMany(LevelTestAttempt, { foreignKey: 'user_id' });
LevelTestAttempt.belongsTo(User, { foreignKey: 'user_id' });

// LevelTest - LevelTestAttempt (1-n)
LevelTest.hasMany(LevelTestAttempt, { foreignKey: 'level_test_id' });
LevelTestAttempt.belongsTo(LevelTest, { foreignKey: 'level_test_id' });

// ==================== QUAN HỆ FEEDBACK ====================
User.hasMany(Feedback, { foreignKey: 'user_id' });
Feedback.belongsTo(User, { foreignKey: 'user_id' });

// ==================== QUAN HỆ USER PROFILE (MỚI) ====================
User.hasOne(UserProfile, { foreignKey: 'user_id' });
UserProfile.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
    User,
    Unit,
    Question,
    Progress,
    UserAnswer,
    Flashcard,
    Dictionary,
    Certificate,
    LevelTest,
    ReadingPassage,
    LevelTestQuestion,
    LevelTestAttempt,
    Feedback,
    UserProfile // <-- Đã export thành công
};