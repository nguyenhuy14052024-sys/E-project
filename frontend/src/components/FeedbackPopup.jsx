import React, { useState } from 'react';
import api from '../services/api';

const FeedbackPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        setMessage('');
        try {
            await api.post('/feedbacks', { 
                content, 
                page_url: window.location.pathname 
            });
            setMessage('Cảm ơn bạn đã gửi góp ý!');
            setContent('');
            setTimeout(() => {
                setIsOpen(false);
                setMessage('');
            }, 2000);
        } catch (error) {
            setMessage('Có lỗi xảy ra, vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Nút lơ lửng */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={styles.floatingBtn}
                title="Gửi góp ý cho chúng tôi"
            >
                💡
            </button>

            {/* Popup Form */}
            {isOpen && (
                <div style={styles.popup}>
                    <div style={styles.header}>
                        <h4 style={{ margin: 0, color: '#0D6EFD' }}>Góp ý & Phản hồi</h4>
                        <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>✕</button>
                    </div>
                    <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                        Bạn thấy trang web thế nào? Có lỗi hay điều gì bất tiện không? Hãy cho chúng tôi biết!
                    </p>
                    
                    {message && <div style={{ color: message.includes('Cảm ơn') ? '#28A745' : '#DC3545', fontSize: '13px', marginBottom: '10px' }}>{message}</div>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Nhập ý kiến của bạn tại đây..."
                            style={styles.textarea}
                            rows="4"
                            required
                        />
                        <button type="submit" disabled={loading} style={styles.submitBtn}>
                            {loading ? 'Đang gửi...' : 'Gửi góp ý'}
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

const styles = {
    floatingBtn: {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#0D6EFD',
        color: 'white',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(13, 110, 253, 0.4)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s',
    },
    popup: {
        position: 'fixed',
        bottom: '90px',
        right: '30px',
        width: '320px',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        zIndex: 9999,
        border: '1px solid #DCE8F5',
        animation: 'fadeIn 0.2s ease-in-out'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        fontSize: '18px',
        cursor: 'pointer',
        color: '#999'
    },
    textarea: {
        width: '100%',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #CED4DA',
        fontSize: '14px',
        resize: 'none',
        outline: 'none',
        fontFamily: 'inherit'
    },
    submitBtn: {
        padding: '10px',
        backgroundColor: '#28A745',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer'
    }
};

export default FeedbackPopup;