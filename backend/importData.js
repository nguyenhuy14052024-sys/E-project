require('dotenv').config();
const sequelize = require('./config/db');
const { Unit, Question } = require('./src/models');
const fs = require('fs');
const path = require('path');

async function importData() {
    try {
        const rawData = fs.readFileSync(
            path.join(__dirname, '..', 'data_migration', 'raw_data', 'demo.json'),
            'utf8'
        );
        const data = JSON.parse(rawData);
        console.log('📖 Đọc dữ liệu từ demo.json thành công!');

        for (const unitData of data.units) {
            const unit = await Unit.create({
                book_level: unitData.book_level,
                unit_number: unitData.unit_number,
                title: unitData.title,
                type: unitData.type,
                description: unitData.description,
                content_html: unitData.content_html
            });
            console.log(`✅ Đã tạo Unit: ${unit.title}`);

            for (const qData of unitData.questions) {
                await Question.create({
                    unit_id: unit.id,
                    question_type: qData.question_type,
                    content: qData.content,
                    options: qData.options,
                    correct_answer: qData.correct_answer,
                    explanation: qData.explanation
                });
            }
            console.log(`✅ Đã tạo ${unitData.questions.length} câu hỏi cho Unit ${unit.title}`);
        }

        console.log('🎉 Import dữ liệu thành công!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi import:', error);
        process.exit(1);
    }
}

importData();