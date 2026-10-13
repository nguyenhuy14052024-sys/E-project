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
    const [filterType, setFilterType] = useState('');

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
        <div style={styles.page}>
            <div style={styles.bgShape1}></div>
            <div style={styles.bgShape2}></div>

            <nav style={styles.navbar}>
                <div style={styles.navTop}>
                    <span style={styles.logo}>EnglishIngLesh</span>
                    <span style={styles.userBadge}>{user.username}</span>
                </div>
                <div style={styles.navMenu}>
                    <Link to="/profile" style={styles.navBtn}>Hồ sơ</Link>
                    <Link to="/mini-test" style={styles.navBtn}>Mini Test</Link>
                    <Link to="/error-log" style={styles.navBtn}>Kho lỗi sai</Link>
                    <Link to="/flashcards" style={styles.navBtn}>Flashcard</Link>
                    <Link to="/review" style={styles.navBtn}>Ôn tập</Link>
                    {user.role === 'admin' && (
                        <Link to="/admin" style={styles.navBtnAdmin}>Admin</Link>
                    )}
                    <button onClick={handleLogout} style={styles.navBtnLogout}>
                        Đăng xuất
                    </button>
                </div>
            </nav>

            <div style={styles.container}>
                <div style={styles.welcomeSection}>
                    <h1 style={styles.welcomeTitle}>Xin chào, {user.username}!</h1>
                    <p style={styles.welcomeEmail}>{user.email}</p>
                </div>

                <div style={styles.levelSelector}>
                    {['A1', 'A2', 'B1', 'B2', 'C1'].map(level => (
                        <button
                            key={level}
                            style={{
                                ...styles.levelButton,
                                ...(selectedLevel === level ? styles.activeLevel : {})
                            }}
                            onClick={() => setSelectedLevel(level)}
                        >
                            {level}
                        </button>
                    ))}
                </div>

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
                        <div style={styles.loadingContainer}>
                            <div style={styles.spinner}></div>
                            <p style={styles.loadingText}>Đang tải...</p>
                        </div>
                    ) : units.length === 0 ? (
                        <div style={styles.emptyState}>
                            <p style={styles.emptyText}>Chưa có Unit nào cho trình độ {selectedLevel}</p>
                        </div>
                    ) : (
                        units.map(unit => (
                            <Link
                                to={`/learn/${unit.id}?type=${filterType}`}
                                key={unit.id}
                                style={styles.unitCard}
                            >
                                <div style={styles.unitHeader}>
                                    <span style={styles.unitNumber}>Unit {unit.unit_number}</span>
                                    <span style={styles.unitType}>{unit.type}</span>
                                </div>
                                <h3 style={styles.unitTitle}>{unit.title}</h3>
                                <p style={styles.unitDesc}>{unit.description}</p>
                                <div style={styles.unitArrow}>→</div>
                            </Link>
                        ))
                    )}
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
        width: '100%',
        maxWidth: '100vw',
        boxSizing: 'border-box'
    },
    bgShape1: {
        position: 'fixed',
        top: '-180px',
        right: '-180px',
        width: '460px',
        height: '460px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13, 110, 253, 0.12) 0%, rgba(13, 110, 253, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
    },
    bgShape2: {
        position: 'fixed',
        bottom: '-160px',
        left: '-100px',
        width: '520px',
        height: '520px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13, 110, 253, 0.08) 0%, rgba(13, 110, 253, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
    },
    navbar: {
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 24px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 1px 3px rgba(13, 110, 253, 0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(220, 232, 245, 0.8)',
        width: '100%',
        boxSizing: 'border-box',
        gap: '10px'
    },
    navTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    logo: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#0D6EFD',
        letterSpacing: '-0.5px'
    },
    userBadge: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#6C757D',
        backgroundColor: '#F0F4F8',
        padding: '4px 12px',
        borderRadius: '20px'
    },
    navMenu: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        width: '100%',
        justifyContent: 'flex-start'
    },
    navBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '7px 14px',
        backgroundColor: '#0D6EFD',
        color: '#FFFFFF',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: '500',
        transition: 'all 0.25s ease',
        cursor: 'pointer',
        border: 'none',
        whiteSpace: 'nowrap'
    },
    navBtnAdmin: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '7px 14px',
        backgroundColor: '#6C757D',
        color: '#FFFFFF',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: '500',
        whiteSpace: 'nowrap'
    },
    navBtnLogout: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '7px 14px',
        backgroundColor: '#DC3545',
        color: '#FFFFFF',
        borderRadius: '8px',
        border: 'none',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
    },
    container: {
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '32px 20px',
        position: 'relative',
        zIndex: 1,
        boxSizing: 'border-box'
    },
    welcomeSection: {
        marginBottom: '24px'
    },
    welcomeTitle: {
        fontSize: 'clamp(20px, 5vw, 28px)',
        fontWeight: '700',
        color: '#212529',
        margin: '0 0 4px 0',
        wordBreak: 'break-word'
    },
    welcomeEmail: {
        fontSize: '14px',
        color: '#6C757D',
        margin: 0,
        wordBreak: 'break-word'
    },
    levelSelector: {
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        flexWrap: 'wrap'
    },
    levelButton: {
        padding: '10px 22px',
        backgroundColor: '#E9ECEF',
        border: '2px solid transparent',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        color: '#495057',
        transition: 'all 0.25s ease'
    },
    activeLevel: {
        backgroundColor: '#0D6EFD',
        color: '#FFFFFF',
        borderColor: '#0D6EFD',
        boxShadow: '0 4px 12px rgba(13, 110, 253, 0.35)'
    },
    filterContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 18px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(13, 110, 253, 0.06)',
        marginBottom: '24px',
        flexWrap: 'wrap'
    },
    filterLabel: {
        fontWeight: '600',
        fontSize: '14px',
        color: '#212529',
        whiteSpace: 'nowrap'
    },
    filterSelect: {
        padding: '10px 16px',
        borderRadius: '8px',
        border: '1px solid #CED4DA',
        fontSize: '14px',
        backgroundColor: '#F8F9FA',
        cursor: 'pointer',
        color: '#212529',
        outline: 'none',
        flex: 1,
        minWidth: '150px',
        maxWidth: '100%',
        boxSizing: 'border-box'
    },
    unitGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '20px'
    },
    unitCard: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '24px',
        borderRadius: '12px',
        border: '2px solid #DCE8F5',
        boxShadow: '0 2px 12px rgba(13, 110, 253, 0.06)',
        textDecoration: 'none',
        color: '#212529',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        boxSizing: 'border-box'
    },
    unitHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        gap: '8px',
        flexWrap: 'wrap'
    },
    unitNumber: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#0D6EFD'
    },
    unitType: {
        display: 'inline-block',
        padding: '4px 12px',
        backgroundColor: '#E7F1FF',
        color: '#0D6EFD',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    unitTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#212529',
        margin: '0 0 8px 0',
        lineHeight: '1.4'
    },
    unitDesc: {
        color: '#6C757D',
        fontSize: '13px',
        lineHeight: '1.5',
        margin: '0 0 16px 0',
        flex: 1
    },
    unitArrow: {
        fontSize: '18px',
        color: '#0D6EFD',
        fontWeight: '700',
        alignSelf: 'flex-end'
    },
    loadingContainer: {
        gridColumn: '1 / -1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px',
        gap: '16px'
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #DCE8F5',
        borderTop: '4px solid #0D6EFD',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
    },
    loadingText: {
        color: '#6C757D',
        fontSize: '14px',
        margin: 0
    },
    emptyState: {
        gridColumn: '1 / -1',
        display: 'flex',
        justifyContent: 'center',
        padding: '48px 24px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        border: '2px dashed #DCE8F5'
    },
    emptyText: {
        color: '#6C757D',
        fontSize: '15px',
        margin: 0,
        textAlign: 'center'
    }
};

if (typeof document !== 'undefined') {
    const existing = document.getElementById('dashboard-keyframes');
    if (!existing) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'dashboard-keyframes';
        styleSheet.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

export default Dashboard;