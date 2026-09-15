import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const menuItems = [
        {
            title: 'Quản lý Unit',
            description: 'Thêm, sửa, xóa các Unit học tập',
            icon: '📚',
            path: '/admin/units',
            color: '#007bff'
        },
        {
            title: 'Quản lý câu hỏi',
            description: 'Thêm, sửa, xóa câu hỏi trong các Unit',
            icon: '❓',
            path: '/admin/questions',
            color: '#28a745'
        },
        {
            title: 'Quản lý người dùng',
            description: 'Xem danh sách, nâng cấp Premium',
            icon: '👥',
            path: '/admin/users',
            color: '#6f42c1'
        }
    ];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>🛠️ Admin Panel</h1>
                <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
                    ← Về Dashboard
                </button>
            </div>

            <div style={styles.grid}>
                {menuItems.map((item, index) => (
                    <Link key={index} to={item.path} style={{ ...styles.card, borderTop: `4px solid ${item.color}` }}>
                        <div style={styles.icon}>{item.icon}</div>
                        <h2 style={styles.cardTitle}>{item.title}</h2>
                        <p style={styles.cardDesc}>{item.description}</p>
                        <span style={{ ...styles.cardArrow, color: item.color }}>→</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px',
        maxWidth: '1000px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px'
    },
    backButton: {
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
    },
    card: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textDecoration: 'none',
        color: '#333',
        position: 'relative',
        transition: 'transform 0.2s, box-shadow 0.2s'
    },
    icon: {
        fontSize: '40px',
        marginBottom: '15px'
    },
    cardTitle: {
        fontSize: '20px',
        marginBottom: '10px'
    },
    cardDesc: {
        color: '#666',
        fontSize: '14px'
    },
    cardArrow: {
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        fontSize: '24px'
    }
};

export default AdminDashboard;