import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import { getUnits } from '../services/unitService';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLevel, setSelectedLevel] = useState('B2');

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);

        fetchUnits(selectedLevel);
    }, [selectedLevel]);

    const fetchUnits = async (level) => {
        setLoading(true);
        try {
            const data = await getUnits(level);
            setUnits(data.units || []);
        } catch (error) {
            console.error('Lỗi lấy danh sách Unit:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1>👋 Chào, {user.username}!</h1>
                    <p style={styles.email}>{user.email}</p>
                </div>
                <button onClick={handleLogout} style={styles.logoutButton}>
                    Đăng xuất
                </button>
            </div>

            <div style={styles.levelSelector}>
                <button
                    style={{ ...styles.levelButton, ...(selectedLevel === 'B2' ? styles.activeLevel : {}) }}
                    onClick={() => setSelectedLevel('B2')}
                >
                    B2
                </button>
                <button
                    style={{ ...styles.levelButton, ...(selectedLevel === 'C1' ? styles.activeLevel : {}) }}
                    onClick={() => setSelectedLevel('C1')}
                >
                    C1
                </button>
                <button
                    style={{ ...styles.levelButton, ...(selectedLevel === 'B1' ? styles.activeLevel : {}) }}
                    onClick={() => setSelectedLevel('B1')}
                >
                    B1 (Sắp ra)
                </button>
            </div>

            <div style={styles.unitGrid}>
                {loading ? (
                    <p>Đang tải...</p>
                ) : units.length === 0 ? (
                    <p>Chưa có Unit nào cho trình độ {selectedLevel}</p>
                ) : (
                    units.map(unit => (
                        <Link to={`/learn/${unit.id}`} key={unit.id} style={styles.unitCard}>
                            <h3>Unit {unit.unit_number}</h3>
                            <p>{unit.title}</p>
                            <span style={styles.unitType}>{unit.type}</span>
                            <p style={styles.unitDesc}>{unit.description}</p>
                        </Link>
                    ))
                )}
            </div>
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
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '1px solid #eee'
    },
    email: {
        color: '#666',
        marginTop: '5px'
    },
    logoutButton: {
        padding: '10px 20px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    levelSelector: {
        display: 'flex',
        gap: '10px',
        marginBottom: '30px'
    },
    levelButton: {
        padding: '10px 30px',
        backgroundColor: '#e9ecef',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px'
    },
    activeLevel: {
        backgroundColor: '#007bff',
        color: 'white'
    },
    unitGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px'
    },
    unitCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textDecoration: 'none',
        color: '#333',
        transition: 'transform 0.2s'
    },
    unitType: {
        display: 'inline-block',
        padding: '3px 10px',
        backgroundColor: '#e9ecef',
        borderRadius: '3px',
        fontSize: '12px',
        marginTop: '10px'
    },
    unitDesc: {
        color: '#666',
        fontSize: '14px',
        marginTop: '5px'
    }
};

export default Dashboard;