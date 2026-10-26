import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1 style={styles.errorCode}>404</h1>
                <h2 style={styles.title}>Trang không tồn tại</h2>
                <p style={styles.description}>
                    Có vẻ như bạn đã đi lạc vào vùng đất chưa được khám phá. 
                    Hãy quay lại trang chủ để tiếp tục hành trình học tập nhé!
                </p>
                <button onClick={() => navigate('/')} style={styles.button}>
                    Về trang chủ
                </button>
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#F6F9FE',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Inter', 'Roboto', sans-serif",
        padding: '20px'
    },
    container: {
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '60px 40px',
        borderRadius: '16px',
        border: '2px solid #DCE8F5',
        boxShadow: '0 8px 32px rgba(13, 110, 253, 0.10)',
        maxWidth: '500px',
        width: '100%'
    },
    errorCode: {
        fontSize: '100px',
        fontWeight: '800',
        color: '#0D6EFD',
        margin: 0,
        lineHeight: '1',
        textShadow: '0 4px 16px rgba(13, 110, 253, 0.25)'
    },
    title: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#212529',
        margin: '20px 0 12px 0'
    },
    description: {
        fontSize: '15px',
        color: '#6C757D',
        lineHeight: '1.6',
        marginBottom: '30px'
    },
    button: {
        padding: '14px 32px',
        backgroundColor: '#0D6EFD',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(13, 110, 253, 0.35)',
        transition: 'all 0.25s ease'
    }
};

export default NotFound;