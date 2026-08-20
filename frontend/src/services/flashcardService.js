import api from './api';

// Lấy danh sách flashcard
export const getFlashcards = async (limit = 50, offset = 0) => {
    try {
        const response = await api.get(`/flashcards?limit=${limit}&offset=${offset}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi lấy danh sách flashcard' };
    }
};

// Thêm flashcard mới
export const createFlashcard = async (data) => {
    try {
        const response = await api.post('/flashcards', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi thêm flashcard' };
    }
};

// Cập nhật flashcard
export const updateFlashcard = async (id, data) => {
    try {
        const response = await api.put(`/flashcards/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi cập nhật flashcard' };
    }
};

// Xóa flashcard
export const deleteFlashcard = async (id) => {
    try {
        const response = await api.delete(`/flashcards/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi xóa flashcard' };
    }
};

// Lấy flashcard đến hạn ôn
export const getDueFlashcards = async (limit = 20) => {
    try {
        const response = await api.get(`/flashcards/due?limit=${limit}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi lấy flashcard đến hạn' };
    }
};

// Ôn tập flashcard
export const reviewFlashcard = async (id, quality) => {
    try {
        const response = await api.post(`/flashcards/${id}/review`, { quality });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi ôn tập flashcard' };
    }
};