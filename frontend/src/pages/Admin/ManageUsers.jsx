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

    const handleToggleRole = async (user) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        if (window.confirm(`Đổi quyền thành ${newRole}?`)) {
            try {
                await updateUser(user.id, { role: newRole });
                fetchUsers();
            } catch (err) {
                setError('Lỗi cập nhật quyền');
            }
        }
    };

    if (loading) return <div style={styles.container}>Đang tải...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>👥 Quản lý người dùng</h1>
                <button onClick={() => navigate('/admin')} style={styles.backButton}>
                    ← Về Admin
                </button>
            </div>

            {error && <div style={styles.error}>{error}</div>}

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
                        <tr key={user.id}>
                            <td style={styles.td}>{user.username}</td>
                            <td style={styles.td}>{user.email}</td>
                            <td style={styles.td}>
                                <span style={{
                                    ...styles.badge,
                                    backgroundColor: user.role === 'admin' ? '#dc3545' : '#007bff'
                                }}>
                                    {user.role}
                                </span>
                            </td>
                            <td style={styles.td}>
                                <span style={{
                                    ...styles.badge,
                                    backgroundColor: user.is_premium ? '#28a745' : '#6c757d'
                                }}>
                                    {user.is_premium ? 'Premium' : 'Free'}
                                </span>
                            </td>
                            <td style={styles.td}>
                                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                            </td>
                            <td style={styles.td}>
                                <button
                                    onClick={() => handleTogglePremium(user)}
                                    style={styles.premiumButton}
                                >
                                    {user.is_premium ? 'Hủy Premium' : 'Nâng Premium'}
                                </button>
                                <button
                                    onClick={() => handleToggleRole(user)}
                                    style={styles.roleButton}
                                >
                                    Đổi Role
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    backButton: {
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'white',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    th: {
        backgroundColor: '#f8f9fa',
        padding: '12px',
        textAlign: 'left',
        borderBottom: '2px solid #dee2e6',
        fontSize: '14px'
    },
    td: {
        padding: '12px',
        borderBottom: '1px solid #eee',
        fontSize: '14px'
    },
    badge: {
        display: 'inline-block',
        padding: '3px 10px',
        color: 'white',
        borderRadius: '3px',
        fontSize: '12px'
    },
    premiumButton: {
        padding: '5px 10px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        marginRight: '5px',
        fontSize: '12px'
    },
    roleButton: {
        padding: '5px 10px',
        backgroundColor: '#6f42c1',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '12px'
    },
    error: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px'
    }
};

export default ManageUsers;