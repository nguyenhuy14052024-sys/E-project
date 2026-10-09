import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, getCertificates } from '../services/profileService';
import CertificateBadge from '../components/CertificateBadge';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [profileData, certData] = await Promise.all([
                getProfile(),
                getCertificates()
            ]);
            setProfile(profileData);
            setCertificates(certData.certificates || []);
        } catch (err) {
            setError('Lỗi tải thông tin');
        } finally {
            setLoading(false);
        }
    };

    const getRankColor = (rank) => {
        const colors = {
            Bronze: '#cd7f32',
            Silver: '#c0c0c0',
            Gold: '#ffd700',
            Platinum: '#e5e4e2',
            Diamond: '#b9f2ff',
            Master: '#ff6b6b'
        };
        return colors[rank] || '#6c757d';
    };

    const getRankProgress = (points) => {
        if (points >= 5000) return 100;
        if (points >= 2000) return ((points - 2000) / 3000) * 100;
        if (points >= 1000) return ((points - 1000) / 1000) * 100;
        if (points >= 500) return ((points - 500) / 500) * 100;
        if (points >= 100) return ((points - 100) / 400) * 100;
        return (points / 100) * 100;
    };

    if (loading) return <div style={styles.container}>Đang tải...</div>;
    if (error) return <div style={styles.container}>{error}</div>;
    if (!profile) return <div style={styles.container}>Không tìm thấy thông tin</div>;

    const { user, stats } = profile;

    return (
        <div style={styles.page}>
            <div style={styles.bgShape1}></div>
            <div style={styles.bgShape2}></div>

            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.pageTitle}>Hồ sơ cá nhân</h1>
                    <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
                        ← Về Dashboard
                    </button>
                </div>

                {/* Thông tin user */}
                <div style={styles.profileCard}>
                    <div style={styles.avatar}>
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div style={styles.userInfo}>
                        <h2 style={styles.username}>{user.username}</h2>
                        <p style={styles.email}>{user.email}</p>
                        <div style={styles.rankContainer}>
                            <span style={{ ...styles.rankBadge, backgroundColor: getRankColor(user.rank) }}>
                                {user.rank}
                            </span>
                            <span style={styles.points}>{user.points} điểm</span>
                        </div>
                        <div style={styles.progressBar}>
                            <div style={{ ...styles.progressFill, width: `${getRankProgress(user.points)}%` }} />
                        </div>
                        <p style={styles.streak}>🔥 Streak: {user.streak} ngày</p>
                    </div>
                </div>

                {/* Thống kê */}
                <div style={styles.statsSection}>
                    <h3 style={styles.sectionTitle}> Thống kê</h3>
                    <div style={styles.statsGrid}>
                        <div style={styles.statCard}>
                            <div style={styles.statValue}>{stats.completedUnits}/{stats.totalUnits}</div>
                            <div style={styles.statLabel}>Unit hoàn thành</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statValue}>{stats.totalFlashcards}</div>
                            <div style={styles.statLabel}>Flashcard</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statValue}>{stats.totalAnswers}</div>
                            <div style={styles.statLabel}>Câu đã làm</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statValue}>{stats.accuracy}%</div>
                            <div style={styles.statLabel}>Độ chính xác</div>
                        </div>
                    </div>
                </div>

                {/* Kho chứng nhận */}
                <div style={styles.certSection}>
                    <h3 style={styles.sectionTitle}>Kho chứng nhận ({certificates.length})</h3>
                    {certificates.length === 0 ? (
                        <div style={styles.emptyState}>
                            <p>Chưa có chứng nhận nào. Hãy học tập để nhận chứng nhận!</p>
                        </div>
                    ) : (
                        <div style={styles.certGrid}>
                            {certificates.map(cert => (
                                <CertificateBadge key={cert.id} certificate={cert} />
                            ))}
                        </div>
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
    container: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '40px',
        position: 'relative',
        zIndex: 1
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
    },
    pageTitle: {
        fontSize: '28px',
        fontWeight: '700',
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
        boxShadow: '0 2px 6px rgba(108, 117, 125, 0.25)',
        transition: 'all 0.25s ease'
    },
    profileCard: {
        display: 'flex',
        gap: '30px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        padding: '30px',
        borderRadius: '12px',
        border: '2px solid #DCE8F5',
        boxShadow: '0 2px 12px rgba(13, 110, 253, 0.06)',
        marginBottom: '30px',
        alignItems: 'center'
    },
    avatar: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: '#0D6EFD',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '48px',
        fontWeight: 'bold',
        boxShadow: '0 4px 12px rgba(13, 110, 253, 0.35)'
    },
    userInfo: {
        flex: 1
    },
    username: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#212529',
        margin: '0 0 6px 0'
    },
    email: {
        color: '#6C757D',
        marginBottom: '12px',
        fontSize: '14px'
    },
    rankContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '10px'
    },
    rankBadge: {
        padding: '5px 15px',
        borderRadius: '20px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '14px'
    },
    points: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#0D6EFD'
    },
    progressBar: {
        height: '10px',
        backgroundColor: '#DCE8F5',
        borderRadius: '5px',
        overflow: 'hidden',
        marginBottom: '10px'
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#0D6EFD',
        transition: 'width 0.5s',
        boxShadow: '0 0 8px rgba(13, 110, 253, 0.6)'
    },
    streak: {
        fontSize: '14px',
        color: '#FD7E14',
        fontWeight: '500'
    },
    statsSection: {
        marginBottom: '30px'
    },
    sectionTitle: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#212529',
        marginBottom: '16px'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px'
    },
    statCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        padding: '20px',
        borderRadius: '12px',
        border: '2px solid #DCE8F5',
        boxShadow: '0 2px 12px rgba(13, 110, 253, 0.06)',
        textAlign: 'center',
        transition: 'all 0.25s ease'
    },
    statValue: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#0D6EFD',
        marginBottom: '5px'
    },
    statLabel: {
        fontSize: '13px',
        color: '#6C757D'
    },
    certSection: {
        marginTop: '20px'
    },
    certGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '15px'
    },
    emptyState: {
        textAlign: 'center',
        padding: '40px',
        color: '#6C757D',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        borderRadius: '12px',
        border: '2px dashed #DCE8F5'
    }
};

export default ProfilePage;