import api from './api';

// ==================== QUẢN LÝ UNIT ====================

export const getAllUnits = async () => {
    try {
        const response = await api.get('/admin/units');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi lấy danh sách Unit' };
    }
};

export const createUnit = async (data) => {
    try {
        const response = await api.post('/admin/units', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi thêm Unit' };
    }
};

export const updateUnit = async (id, data) => {
    try {
        const response = await api.put(`/admin/units/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi cập nhật Unit' };
    }
};

export const deleteUnit = async (id) => {
    try {
        const response = await api.delete(`/admin/units/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi xóa Unit' };
    }
};

// ==================== QUẢN LÝ CÂU HỎI ====================

export const getQuestionsByUnit = async (unitId) => {
    try {
        const response = await api.get(`/admin/units/${unitId}/questions`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi lấy danh sách câu hỏi' };
    }
};

export const createQuestion = async (data) => {
    try {
        const response = await api.post('/admin/questions', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi thêm câu hỏi' };
    }
};

export const updateQuestion = async (id, data) => {
    try {
        const response = await api.put(`/admin/questions/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi cập nhật câu hỏi' };
    }
};

export const deleteQuestion = async (id) => {
    try {
        const response = await api.delete(`/admin/questions/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi xóa câu hỏi' };
    }
};

// ==================== QUẢN LÝ NGƯỜI DÙNG ====================

export const getAllUsers = async () => {
    try {
        const response = await api.get('/admin/users');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi lấy danh sách người dùng' };
    }
};

export const updateUser = async (id, data) => {
    try {
        const response = await api.put(`/admin/users/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi cập nhật người dùng' };
    }
};