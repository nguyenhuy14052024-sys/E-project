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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <div style={styles.bgShape3}></div>

            <nav style={styles.navbar}>
                <div style={styles.navLeft}>
                    <span style={styles.logo}>EnglishIngLesh</span>
                </div>
                <button
                    style={styles.mobileMenuToggle}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? '✕' : '☰'}
                </button>
                <div style={{
                    ...styles.navRight,
                    ...(isMobileMenuOpen ? styles.navRightOpen : {})
                }}>
                    <Link to="/profile" style={styles.navBtn}>
                        Hồ sơ
                    </Link>
                    <Link to="/mini-test" style={styles.navBtn}>
                        Mini Test
                    </Link>
                    <Link to="/error-log" style={styles.navBtn}>
                        Kho lỗi sai
                    </Link>
                    <Link to="/flashcards" style={styles.navBtn}>
                        Flashcard
                    </Link>
                    <Link to="/review" style={styles.navBtn}>
                        Ôn tập hôm nay
                    </Link>
                    {user.role === 'admin' && (
                        <Link to="/admin" style={styles.navBtnAdmin}>
                            Admin
                        </Link>
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
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(13, 110, 253, 0.20)';
                                    e.currentTarget.style.borderColor = '#0D6EFD';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(13, 110, 253, 0.06)';
                                    e.currentTarget.style.borderColor = '#DCE8F5';
                                }}
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
        overflow: 'hidden'
    },
    bgShape1: {
        position: 'fixed',
        top: '-120px',
        right: '-120px',
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
    bgShape3: {
        position: 'fixed',
        top: '40%',
        left: '50%',
        width: '640px',
        height: '640px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13, 110, 253, 0.05) 0%, rgba(13, 110, 253, 0) 70%)',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 0
    },
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 32px',
        height: '64px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 1px 3px rgba(13, 110, 253, 0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(220, 232, 245, 0.8)'
    },
    navLeft: {
        display: 'flex',
        alignItems: 'center'
    },
    logo: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#0D6EFD',
        letterSpacing: '-0.5px'
    },
    mobileMenuToggle: {
        display: 'none',
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#0D6EFD',
        padding: '8px'
    },
    navRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    navRightOpen: {},
    navBtn: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        backgroundColor: '#0D6EFD',
        color: '#FFFFFF',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.25s ease',
        cursor: 'pointer',
        border: 'none',
        boxShadow: '0 2px 6px rgba(13, 110, 253, 0.25)'
    },
    navBtnAdmin: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        backgroundColor: '#6C757D',
        color: '#FFFFFF',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.25s ease',
        cursor: 'pointer',
        border: 'none',
        boxShadow: '0 2px 6px rgba(108, 117, 125, 0.25)'
    },
    navBtnLogout: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        backgroundColor: '#DC3545',
        color: '#FFFFFF',
        borderRadius: '8px',
        border: 'none',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.25s ease',
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(220, 53, 69, 0.25)'
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px',
        position: 'relative',
        zIndex: 1
    },
    welcomeSection: {
        marginBottom: '32px'
    },
    welcomeTitle: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#212529',
        margin: '0 0 4px 0'
    },
    welcomeEmail: {
        fontSize: '14px',
        color: '#6C757D',
        margin: 0
    },
    levelSelector: {
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        flexWrap: 'wrap'
    },
    levelButton: {
        padding: '10px 28px',
        backgroundColor: '#E9ECEF',
        border: '2px solid transparent',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '15px',
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
        gap: '16px',
        padding: '16px 24px',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(13, 110, 253, 0.06)',
        marginBottom: '32px',
        flexWrap: 'wrap',
        border: '1px solid rgba(220, 232, 245, 0.8)'
    },
    filterLabel: {
        fontWeight: '600',
        fontSize: '14px',
        color: '#212529',
        whiteSpace: 'nowrap'
    },
    filterSelect: {
        padding: '10px 20px',
        borderRadius: '8px',
        border: '1px solid #CED4DA',
        fontSize: '14px',
        backgroundColor: '#F8F9FA',
        cursor: 'pointer',
        color: '#212529',
        outline: 'none',
        transition: 'all 0.25s ease',
        minWidth: '200px'
    },
    unitGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px'
    },
    unitCard: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    padding: '24px',
    borderRadius: '12px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#DCE8F5',
    boxShadow: '0 2px 12px rgba(13, 110, 253, 0.06)',
    textDecoration: 'none',
    color: '#212529',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
    },
    
    unitHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
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
        alignSelf: 'flex-end',
        transition: 'transform 0.2s ease'
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
        padding: '64px',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        borderRadius: '12px',
        border: '2px dashed #DCE8F5'
    },
    emptyText: {
        color: '#6C757D',
        fontSize: '15px',
        margin: 0
    }
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    @keyframes neonPulseBlue {
        0% { box-shadow: 0 0 8px rgba(13, 110, 253, 0.8), 0 0 20px rgba(13, 110, 253, 0.6), 0 0 40px rgba(13, 110, 253, 0.4); }
        50% { box-shadow: 0 0 12px rgba(13, 110, 253, 1), 0 0 28px rgba(13, 110, 253, 0.8), 0 0 52px rgba(13, 110, 253, 0.5); }
        100% { box-shadow: 0 0 8px rgba(13, 110, 253, 0.8), 0 0 20px rgba(13, 110, 253, 0.6), 0 0 40px rgba(13, 110, 253, 0.4); }
    }
    @keyframes neonPulseGray {
        0% { box-shadow: 0 0 8px rgba(108, 117, 125, 0.8), 0 0 20px rgba(108, 117, 125, 0.6), 0 0 40px rgba(108, 117, 125, 0.4); }
        50% { box-shadow: 0 0 12px rgba(108, 117, 125, 1), 0 0 28px rgba(108, 117, 125, 0.8), 0 0 52px rgba(108, 117, 125, 0.5); }
        100% { box-shadow: 0 0 8px rgba(108, 117, 125, 0.8), 0 0 20px rgba(108, 117, 125, 0.6), 0 0 40px rgba(108, 117, 125, 0.4); }
    }
    @keyframes neonPulseRed {
        0% { box-shadow: 0 0 8px rgba(220, 53, 69, 0.8), 0 0 20px rgba(220, 53, 69, 0.6), 0 0 40px rgba(220, 53, 69, 0.4); }
        50% { box-shadow: 0 0 12px rgba(220, 53, 69, 1), 0 0 28px rgba(220, 53, 69, 0.8), 0 0 52px rgba(220, 53, 69, 0.5); }
        100% { box-shadow: 0 0 8px rgba(220, 53, 69, 0.8), 0 0 20px rgba(220, 53, 69, 0.6), 0 0 40px rgba(220, 53, 69, 0.4); }
    }
    a[style*="backgroundColor: rgb(13, 110, 253)"]:hover,
    a[style*="background-color: rgb(13, 110, 253)"]:hover {
        transform: translateY(-4px) scale(1.04) !important;
        animation: neonPulseBlue 1.2s ease-in-out infinite !important;
        filter: brightness(1.15) !important;
    }
    a[style*="backgroundColor: rgb(108, 117, 125)"]:hover,
    a[style*="background-color: rgb(108, 117, 125)"]:hover {
        transform: translateY(-4px) scale(1.04) !important;
        animation: neonPulseGray 1.2s ease-in-out infinite !important;
        filter: brightness(1.15) !important;
    }
    button[style*="backgroundColor: rgb(220, 53, 69)"]:hover,
    button[style*="background-color: rgb(220, 53, 69)"]:hover {
        transform: translateY(-4px) scale(1.04) !important;
        animation: neonPulseRed 1.2s ease-in-out infinite !important;
        filter: brightness(1.15) !important;
    }
    button[style*="backgroundColor: rgb(233, 236, 239)"]:hover,
    button[style*="background-color: rgb(233, 236, 239)"]:hover {
        transform: translateY(-4px) scale(1.04) !important;
        animation: neonPulseBlue 1.2s ease-in-out infinite !important;
        background-color: #0D6EFD !important;
        color: #FFFFFF !important;
    }
    select[style*="filterSelect"]:hover {
        border-color: #0D6EFD !important;
        box-shadow: 0 0 8px rgba(13, 110, 253, 0.5), 0 0 16px rgba(13, 110, 253, 0.3) !important;
    }
    a:hover {
        opacity: 1;
    }
    button:hover {
        opacity: 1;
    }
    @media (max-width: 768px) {
        nav {
            padding: 0 16px !important;
            height: auto !important;
            flex-wrap: wrap !important;
        }
        nav > div:last-child {
            display: none !important;
            flex-direction: column !important;
            width: 100% !important;
            padding: 16px 0 !important;
            gap: 8px !important;
        }
        nav > div:last-child a,
        nav > div:last-child button {
            width: 100% !important;
            justify-content: center !important;
        }
        nav > button:first-of-type {
            display: block !important;
        }
        [style*="unitGrid"] {
            grid-template-columns: 1fr !important;
        }
        [style*="container"] {
            padding: 16px !important;
        }
        [style*="welcomeTitle"] {
            font-size: 22px !important;
        }
    }
`;
document.head.appendChild(styleSheet);

export default Dashboard;