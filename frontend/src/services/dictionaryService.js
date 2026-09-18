import api from './api';

// Tra từ
export const lookupWord = async (word) => {
    try {
        const response = await api.get(`/dictionary/${encodeURIComponent(word)}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi tra từ' };
    }
};