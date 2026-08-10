const User = require('./User');
const Unit = require('./Unit');
const Question = require('./Question');
const Progress = require('./Progress');
const UserAnswer = require('./UserAnswer');
const Flashcard = require('./Flashcard');

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

// Unit - Flashcard (1-n)  // ← THÊM QUAN HỆ NÀY
Unit.hasMany(Flashcard, { foreignKey: 'unit_id' });
Flashcard.belongsTo(Unit, { foreignKey: 'unit_id' });

module.exports = {
    User,
    Unit,
    Question,
    Progress,
    UserAnswer,
    Flashcard
};