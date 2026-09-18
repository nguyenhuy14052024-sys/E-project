const axios = require('axios');
const { Dictionary } = require('../models');

// Cache timeout (ms) - 7 ngày
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

// Tra từ từ Free Dictionary API
const fetchFromFreeDictionary = async (word) => {
    try {
        console.log('🔍 [Free Dictionary] Bắt đầu gọi API cho:', word);
        
        const response = await axios.get(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
            { 
                timeout: 15000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json'
                }
            }
        );

        console.log('🔍 [Free Dictionary] Status:', response.status);
        console.log('🔍 [Free Dictionary] Data length:', response.data.length);

        const data = response.data[0];
        const meaning = data.meanings[0];
        const definition = meaning.definitions[0];

        console.log('✅ [Free Dictionary] Thành công!');

        return {
            word: data.word,
            pronunciation: data.phonetic || data.phonetics?.[0]?.text || '',
            audio_url: data.phonetics?.find(p => p.audio)?.audio || '',
            definition_en: definition.definition,
            example: definition.example || '',
            word_type: meaning.partOfSpeech,
            source: 'Free Dictionary'
        };
    } catch (error) {
        console.log('❌ [Free Dictionary] Lỗi:', error.message);
        console.log('❌ [Free Dictionary] Code:', error.code);
        if (error.response) {
            console.log('❌ [Free Dictionary] Status:', error.response.status);
            console.log('❌ [Free Dictionary] Data:', error.response.data);
        }
        return null;
    }
};
// Tra từ từ Datamuse API (từ đồng nghĩa)
const fetchFromDatamuse = async (word) => {
    try {
        const response = await axios.get(
            `https://api.datamuse.com/words?sp=${word}&md=d&max=1`,
            { timeout: 5000 }
        );

        if (response.data.length === 0) return null;

        const data = response.data[0];
        return {
            word: data.word,
            definition_en: data.defs?.[0] || 'Không có định nghĩa',
            word_type: 'unknown',
            source: 'Datamuse'
        };
    } catch (error) {
        console.log('Datamuse API failed:', error.message);
        return null;
    }
};

// Tra từ từ Google Translate (unofficial) - Anh-Việt
const fetchFromGoogleTranslate = async (word) => {
    try {
        const response = await axios.get(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(word)}`,
            { timeout: 5000 }
        );

        const translation = response.data[0][0][0];
        return {
            word,
            definition_vi: translation,
            source: 'Google Translate'
        };
    } catch (error) {
        console.log('Google Translate API failed:', error.message);
        return null;
    }
};

// Hàm chính: tra từ với fallback
const lookupWord = async (word) => {
    const normalizedWord = word.toLowerCase().trim();

    // 1. Kiểm tra cache
    const cached = await Dictionary.findOne({
        where: { word: normalizedWord }
    });

    if (cached) {
        const cacheAge = Date.now() - new Date(cached.updatedAt).getTime();
        if (cacheAge < CACHE_TTL) {
            console.log('✅ Cache hit:', normalizedWord);
            return { ...cached.toJSON(), source: 'cache' };
        }
    }

    console.log('🔍 Tra từ mới:', normalizedWord);

    // 2. Thử Datamuse TRƯỚC (nhanh hơn)
    let result = await fetchFromDatamuse(normalizedWord);
    if (result) console.log('✅ Datamuse OK');

    // 3. Nếu Datamuse thất bại, thử Free Dictionary
    if (!result) {
        result = await fetchFromFreeDictionary(normalizedWord);
        if (result) console.log('✅ Free Dictionary OK');
    }

    // 4. Nếu vẫn thất bại, thử Google Translate
    if (!result) {
        result = await fetchFromGoogleTranslate(normalizedWord);
        if (result) console.log('✅ Google Translate OK');
    }

    // 5. Lưu cache
    if (!result) {
        console.log('❌ Tất cả API đều thất bại');
        return null;
    }

    try {
        if (cached) {
            await cached.update(result);
        } else {
            await Dictionary.create({
                word: normalizedWord,
                ...result
            });
        }
    } catch (error) {
        console.error('Cache save error:', error.message);
    }

    return result;
};

module.exports = { lookupWord };