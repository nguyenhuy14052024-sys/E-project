import api from './api';

// Lấy thông tin profile
export const getProfile = async () => {
    try {
        const response = await api.get('/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi lấy profile' };
    }
};

// Lấy danh sách chứng nhận
export const getCertificates = async () => {
    try {
        const response = await api.get('/profile/certificates');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi lấy chứng nhận' };
    }
};