import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const menuItems = [
        {
            title: 'Quản lý Unit',
            description: 'Thêm, sửa, xóa các Unit học tập',
            label: 'UNITS',
            path: '/admin/units',
            color: '#0D6EFD',
            bgColor: '#E7F1FF'
        },
        {
            title: 'Quản lý câu hỏi',
            description: 'Thêm, sửa, xóa câu hỏi trong các Unit',
            label: 'QUESTIONS',
            path: '/admin/questions',
            color: '#28A745',
            bgColor: '#D4EDDA'
        },
        {
            title: 'Quản lý người dùng',
            description: 'Xem danh sách, nâng cấp Premium',
            label: 'USERS',
            path: '/admin/users',
            color: '#6F42C1',
            bgColor: '#E2D9F3'
        }
    ];

    return (
        <div style={styles.page}>
            <div style={styles.bgShape1}></div>
            <div style={styles.bgShape2}></div>

            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Admin Panel</h1>
                    <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
                        ← Về Dashboard
                    </button>
                </div>

                <div style={styles.grid}>
                    {menuItems.map((item, index) => (
                        <Link 
                            key={index} 
                            to={item.path} 
                            style={{ 
                                ...styles.card, 
                                borderTopColor: item.color 
                            }}
                        >
                            <span 
                                style={{ 
                                    ...styles.label, 
                                    color: item.color,
                                    backgroundColor: item.bgColor
                                }}
                            >
                                {item.label}
                            </span>
                            <h2 style={styles.cardTitle}>{item.title}</h2>
                            <p style={styles.cardDesc}>{item.description}</p>
                            <span style={{ ...styles.cardArrow, color: item.color }}>→</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#F6F9FE',
        fontFamily: "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        padding: '40px 24px'
    },
    bgShape1: {
        position: 'fixed',
        top: '-180px',
        right: '-180px',
        width: '520px',
        height: '520px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13, 110, 253, 0.12) 0%, rgba(13, 110, 253, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
    },
    bgShape2: {
        position: 'fixed',
        bottom: '-200px',
        left: '-150px',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13, 110, 253, 0.08) 0%, rgba(13, 110, 253, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
    },
    container: {
        maxWidth: '1000px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px'
    },
    title: {
        fontSize: '32px',
        fontWeight: '800',
        color: '#212529',
        margin: 0
    },
    backButton: {
        padding: '10px 20px',
        backgroundColor: '#6C757D',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 2px 6px rgba(108, 117, 125, 0.25)'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
    },
    card: {
        position: 'relative',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '32px',
        borderRadius: '16px',
        border: '2px solid #DCE8F5',
        borderTop: '4px solid #0D6EFD',
        boxShadow: '0 2px 12px rgba(13, 110, 253, 0.06)',
        textDecoration: 'none',
        color: '#212529',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    label: {
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '0.8px',
        width: 'fit-content'
    },
    cardTitle: {
        fontSize: '20px',
        fontWeight: '700',
        margin: 0,
        color: '#212529'
    },
    cardDesc: {
        color: '#6C757D',
        fontSize: '14px',
        margin: 0,
        lineHeight: '1.6'
    },
    cardArrow: {
        fontSize: '24px',
        fontWeight: '700',
        alignSelf: 'flex-end',
        marginTop: '8px'
    }
};

export default AdminDashboard;