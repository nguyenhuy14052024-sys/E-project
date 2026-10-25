import api from './api';

// ==================== USER ====================

// Lấy bài test để làm
export const getTestForUser = async (id) => {
    try {
        const response = await api.get(`/level-tests/take/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi lấy bài test' };
    }
};

// Nộp bài test
export const submitTest = async (testId, answers, timeSpent) => {
    try {
        const response = await api.post('/level-tests/submit', {
            testId,
            answers,
            timeSpent
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi nộp bài' };
    }
};

// Lấy lịch sử làm bài
export const getMyAttempts = async (testId = null) => {
    try {
        let url = '/level-tests/my-attempts';
        if (testId) url += `?testId=${testId}`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi lấy lịch sử làm bài' };
    }
};

// Lấy chi tiết lần làm bài
export const getAttemptById = async (id) => {
    try {
        const response = await api.get(`/level-tests/attempts/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi lấy chi tiết lần làm bài' };
    }
};

// ==================== ADMIN ====================

// Lấy danh sách Level Test
// Lấy danh sách Level Test (Dành cho Admin)
export const getAllLevelTests = async () => {
    try {
        const response = await api.get('/level-tests');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi lấy danh sách Level Test' };
    }
};

// Lấy danh sách Level Test (Dành cho User - Không cần quyền Admin)
export const getLevelTestsForUser = async () => {
    try {
        const response = await api.get('/level-tests/list-for-user');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi lấy danh sách Level Test' };
    }
};

// Lấy chi tiết Level Test
export const getLevelTestById = async (id) => {
    try {
        const response = await api.get(`/level-tests/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi lấy chi tiết Level Test' };
    }
};

// Tạo Level Test mới
export const createLevelTest = async (data) => {
    try {
        const response = await api.post('/level-tests', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi tạo Level Test' };
    }
};

// Cập nhật Level Test
export const updateLevelTest = async (id, data) => {
    try {
        const response = await api.put(`/level-tests/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi cập nhật Level Test' };
    }
};

// Xóa Level Test
export const deleteLevelTest = async (id) => {
    try {
        const response = await api.delete(`/level-tests/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi xóa Level Test' };
    }
};

// Lấy câu hỏi của Level Test
export const getQuestionsByTest = async (testId) => {
    try {
        const response = await api.get(`/level-tests/${testId}/questions`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi lấy danh sách câu hỏi' };
    }
};

// Tạo câu hỏi mới
export const createQuestion = async (data) => {
    try {
        const response = await api.post('/level-tests/questions', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi tạo câu hỏi' };
    }
};

// Cập nhật câu hỏi
export const updateQuestion = async (id, data) => {
    try {
        const response = await api.put(`/level-tests/questions/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi cập nhật câu hỏi' };
    }
};

// Xóa câu hỏi
export const deleteQuestion = async (id) => {
    try {
        const response = await api.delete(`/level-tests/questions/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi xóa câu hỏi' };
    }
};

// Tạo bài đọc mới
export const createPassage = async (data) => {
    try {
        const response = await api.post('/level-tests/passages', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi tạo bài đọc' };
    }
};

// Cập nhật bài đọc
export const updatePassage = async (id, data) => {
    try {
        const response = await api.put(`/level-tests/passages/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi cập nhật bài đọc' };
    }
};

// Xóa bài đọc
export const deletePassage = async (id) => {
    try {
        const response = await api.delete(`/level-tests/passages/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi xóa bài đọc' };
    }
};