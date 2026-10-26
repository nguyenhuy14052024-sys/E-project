import axios from 'axios';

const api = axios.create({
    baseURL: 'https://rebecca-retrieved-hitachi-bool.trycloudflare.com/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Gắn token vào request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Xử lý lỗi trả về (Đặc biệt là lỗi 401 - Hết hạn token)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token hết hạn hoặc không hợp lệ
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Tránh chuyển hướng liên tục nếu đang ở trang login
            if (!window.location.pathname.includes('/login')) {
                alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;