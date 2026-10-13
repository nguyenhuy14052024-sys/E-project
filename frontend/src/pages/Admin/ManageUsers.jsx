import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, updateUser } from '../../services/adminService';

const ManageUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data.users || []);
        } catch (err) {
            setError('Lỗi tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePremium = async (user) => {
        try {
            await updateUser(user.id, { is_premium: !user.is_premium });
            fetchUsers();
        } catch (err) {
            setError('Lỗi cập nhật Premium');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div style={styles.page}>
                <div style={styles.container}>
                    <div style={styles.loadingWrapper}>
                        <div style={styles.spinner}></div>
                        <p style={styles.loadingText}>Đang tải danh sách người dùng...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Quản lý người dùng</h1>
                    <button onClick={() => navigate('/admin')} style={styles.backButton}>
                        ← Về Admin
                    </button>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                <div style={styles.statsBar}>
                    <div style={styles.statItem}>
                        <span style={styles.statValue}>{users.length}</span>
                        <span style={styles.statLabel}>Tổng người dùng</span>
                    </div>
                    <div style={styles.statItem}>
                        <span style={styles.statValue}>
                            {users.filter(u => u.role === 'admin').length}
                        </span>
                        <span style={styles.statLabel}>Admin</span>
                    </div>
                    <div style={styles.statItem}>
                        <span style={styles.statValue}>
                            {users.filter(u => u.is_premium).length}
                        </span>
                        <span style={styles.statLabel}>Premium</span>
                    </div>
                </div>

                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Username</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Role</th>
                                <th style={styles.th}>Premium</th>
                                <th style={styles.th}>Ngày tạo</th>
                                <th style={styles.th}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <div style={styles.userCell}>
                                            <div style={styles.avatar}>
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={styles.username}>{user.username}</span>
                                        </div>
                                    </td>
                                    <td style={styles.td}>{user.email}</td>
                                    <td style={styles.td}>
                                        <span style={{
                                            ...styles.badge,
                                            backgroundColor: user.role === 'admin' ? '#DC3545' : '#0D6EFD'
                                        }}>
                                            {user.role === 'admin' ? 'Admin' : 'User'}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={{
                                            ...styles.badge,
                                            backgroundColor: user.is_premium ? '#28A745' : '#6C757D'
                                        }}>
                                            {user.is_premium ? 'Premium' : 'Free'}
                                        </span>
                                    </td>
                                    <td style={styles.td}>{formatDate(user.createdAt)}</td>
                                    <td style={styles.td}>
                                        {user.role !== 'admin' ? (
                                            <button
                                                onClick={() => handleTogglePremium(user)}
                                                style={{
                                                    ...styles.actionButton,
                                                    backgroundColor: user.is_premium ? '#6C757D' : '#28A745'
                                                }}
                                            >
                                                {user.is_premium ? 'Hủy Premium' : 'Nâng Premium'}
                                            </button>
                                        ) : (
                                            <span style={styles.adminNote}>Admin cố định</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
        padding: '40px 20px',
        width: '100%',
        maxWidth: '100vw',
        boxSizing: 'border-box',
        overflow: 'hidden'
    },
    container: {
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
    },
    title: {
        fontSize: 'clamp(22px, 5vw, 28px)',
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
    statsBar: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
    },
    statItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '18px',
        borderRadius: '12px',
        border: '2px solid #DCE8F5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        boxSizing: 'border-box'
    },
    statValue: {
        fontSize: 'clamp(22px, 5vw, 28px)',
        fontWeight: '800',
        color: '#0D6EFD'
    },
    statLabel: {
        fontSize: '13px',
        color: '#6C757D',
        fontWeight: '500'
    },
    tableWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        border: '2px solid #DCE8F5',
        boxShadow: '0 2px 12px rgba(13, 110, 253, 0.06)',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        width: '100%',
        boxSizing: 'border-box'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '700px'
    },
    th: {
        backgroundColor: '#F6F9FE',
        padding: '14px 16px',
        textAlign: 'left',
        borderBottom: '2px solid #DCE8F5',
        fontSize: '13px',
        fontWeight: '700',
        color: '#495057',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        whiteSpace: 'nowrap'
    },
    tr: {
        transition: 'background-color 0.2s'
    },
    td: {
        padding: '14px 16px',
        borderBottom: '1px solid #DCE8F5',
        fontSize: '14px',
        color: '#495057',
        whiteSpace: 'nowrap'
    },
    userCell: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    avatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#0D6EFD',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: '700',
        flexShrink: 0
    },
    username: {
        fontWeight: '600',
        color: '#212529'
    },
    badge: {
        display: 'inline-block',
        padding: '4px 12px',
        color: '#FFFFFF',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap'
    },
    actionButton: {
        padding: '6px 12px',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap'
    },
    adminNote: {
        fontSize: '12px',
        color: '#6C757D',
        fontStyle: 'italic',
        whiteSpace: 'nowrap'
    },
    error: {
        backgroundColor: '#F8D7DA',
        color: '#721C24',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '14px'
    },
    loadingWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px',
        gap: '20px'
    },
    spinner: {
        width: '48px',
        height: '48px',
        border: '4px solid #DCE8F5',
        borderTop: '4px solid #0D6EFD',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
    },
    loadingText: {
        color: '#6C757D',
        fontSize: '15px',
        fontWeight: '500',
        margin: 0
    }
};

if (typeof document !== 'undefined') {
    const existing = document.getElementById('manageusers-keyframes');
    if (!existing) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'manageusers-keyframes';
        styleSheet.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

export default ManageUsers;