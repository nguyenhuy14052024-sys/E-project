const User = require('./User');
const Unit = require('./Unit');
const Question = require('./Question');
const Progress = require('./Progress');
const UserAnswer = require('./UserAnswer');
const Flashcard = require('./Flashcard');
const Dictionary = require('./Dictionary');  // ← THÊM DÒNG NÀY

// ... các quan hệ khác

module.exports = {
    User,
    Unit,
    Question,
    Progress,
    UserAnswer,
    Flashcard,
    Dictionary
};