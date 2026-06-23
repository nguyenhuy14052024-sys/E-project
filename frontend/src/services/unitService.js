import api from './api';

export const getUnits = async (level = 'B2') => {
    try {
        const response = await api.get(`/units?level=${level}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi lấy danh sách Unit' };
    }
};

export const getUnitById = async (id) => {
    try {
        const response = await api.get(`/units/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi lấy chi tiết Unit' };
    }
};

export const getQuestions = async (unitId) => {
    try {
        const response = await api.get(`/quizzes/${unitId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi lấy câu hỏi' };
    }
};

export const submitQuiz = async (unitId, answers) => {
    try {
        const response = await api.post('/quizzes/submit', { unitId, answers });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi nộp bài' };
    }
};