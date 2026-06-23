import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

const Home = () => {
    const isLoggedIn = isAuthenticated();

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}>📚 E-Learning B2-C1</h1>
                <p style={styles.subtitle}>
                    Học tiếng Anh chuẩn Destination với hệ thống bài tập thông minh
                </p>
                <div style={styles.features}>
                    <div style={styles.feature}>
                        <span style={styles.icon}>📖</span>
                        <p>Lý thuyết chi tiết theo từng Unit</p>
                    </div>
                    <div style={styles.feature}>
                        <span style={styles.icon}>✍️</span>
                        <p>Bài tập đa dạng, chấm điểm tự động</p>
                    </div>
                    <div style={styles.feature}>
                        <span style={styles.icon}>📊</span>
                        <p>Kho lỗi sai và theo dõi tiến độ</p>
                    </div>
                    <div style={styles.feature}>
                        <span style={styles.icon}>🔄</span>
                        <p>Flashcard với thuật toán ôn tập thông minh</p>
                    </div>
                </div>
                <Link to={isLoggedIn ? '/dashboard' : '/login'} style={styles.button}>
                    {isLoggedIn ? '🚀 Vào học ngay' : '🔐 Bắt đầu ngay'}
                </Link>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa'
    },
    content: {
        textAlign: 'center',
        maxWidth: '800px',
        padding: '40px'
    },
    title: {
        fontSize: '48px',
        color: '#2c3e50',
        marginBottom: '10px'
    },
    subtitle: {
        fontSize: '20px',
        color: '#666',
        marginBottom: '40px'
    },
    features: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
    },
    feature: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    icon: {
        fontSize: '36px',
        display: 'block',
        marginBottom: '10px'
    },
    button: {
        display: 'inline-block',
        padding: '15px 40px',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '30px',
        textDecoration: 'none',
        fontSize: '18px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s'
    }
};

export default Home;