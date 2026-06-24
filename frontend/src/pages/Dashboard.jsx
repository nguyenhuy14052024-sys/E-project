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
    const [filterType, setFilterType] = useState(''); // ← THÊM DÒNG NÀY

    // ... phần còn lại giữ nguyên

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
            console.error('Loi lay danh sach Unit:', error);
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
                    <h1>Xin chào, {user.username}!</h1>
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

            {/* BỘ LỌC CÂU HỎI */}
            <div style={styles.filterContainer}>
                <label style={styles.filterLabel}>Lọc câu hỏi:</label>
                <select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                    style={styles.filterSelect}
                >
                    <option value="">Tất cả</option>
                    <option value="multiple_choice">Trắc nghiệm (ABCD)</option>
                    <option value="gap_filling">Điền từ</option>
                    <option value="word_formation">Biến đổi từ</option>
                    <option value="sentence_transformation">Viết lại câu</option>
                    <option value="error_correction">Sửa lỗi</option>
                    <option value="collocation">Collocations</option>
                </select>
            </div>

            <div style={styles.unitGrid}>
                {loading ? (
                    <p>Dang tai...</p>
                ) : units.length === 0 ? (
                    <p>Chua co Unit nao cho trinh do {selectedLevel}</p>
                ) : (
                    units.map(unit => (
                        <Link 
                            to={`/learn/${unit.id}?type=${filterType}`} 
                            key={unit.id} 
                            style={styles.unitCard}
                        >
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
        marginBottom: '20px'
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
    // Style cho bộ lọc
    filterContainer: {
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
    },
    filterLabel: {
        fontWeight: 'bold',
        fontSize: '14px',
        color: '#333'
    },
    filterSelect: {
        padding: '8px 16px',
        borderRadius: '6px',
        border: '1px solid #ced4da',
        fontSize: '14px',
        backgroundColor: 'white',
        cursor: 'pointer'
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