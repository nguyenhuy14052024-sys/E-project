import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ManageFeedbacks = () => {
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const res = await api.get('/feedbacks');
            setFeedbacks(res.data.feedbacks);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải...</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h1 style={{ margin: 0 }}>Hộp thư Góp ý ({feedbacks.length})</h1>
                <button onClick={() => navigate('/admin')} style={{ padding: '10px 20px', backgroundColor: '#6C757D', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    ← Về Admin
                </button>
            </div>

            {feedbacks.length === 0 ? (
                <p>Chưa có góp ý nào.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {feedbacks.map((fb) => (
                        <div key={fb.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #DCE8F5' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px', color: '#6C757D' }}>
                                <span>Người gửi: <strong>{fb.User ? fb.User.username : 'Khách (Chưa đăng nhập)'}</strong></span>
                                <span>{new Date(fb.createdAt).toLocaleString('vi-VN')}</span>
                            </div>
                            <p style={{ fontSize: '15px', color: '#212529', margin: '0 0 10px 0', lineHeight: '1.6' }}>"{fb.content}"</p>
                            <div style={{ fontSize: '12px', color: '#0D6EFD', backgroundColor: '#E7F1FF', padding: '4px 10px', borderRadius: '20px', display: 'inline-block' }}>
                                📍 Trang: {fb.page_url || 'Không rõ'}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageFeedbacks;