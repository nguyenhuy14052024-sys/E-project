const { lookupWord } = require('../services/dictionaryService');

// Tra từ
const lookup = async (req, res) => {
    try {
        const { word } = req.params;

        if (!word || word.trim() === '') {
            return res.status(400).json({ 
                message: 'Vui lòng nhập từ cần tra' 
            });
        }

        const result = await lookupWord(word);

        if (!result) {
            return res.status(404).json({ 
                message: 'Không tìm thấy từ này',
                word
            });
        }

        res.status(200).json({
            message: 'Tra từ thành công',
            entry: result
        });

    } catch (error) {
        console.error('Dictionary lookup error:', error);
        res.status(500).json({ 
            message: 'Lỗi tra từ',
            error: error.message 
        });
    }
};

module.exports = { lookup };