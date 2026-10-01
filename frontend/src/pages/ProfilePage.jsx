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
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>👤 Hồ sơ cá nhân</h1>
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
                    <h2>{user.username}</h2>
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
                <h3>📊 Thống kê</h3>
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
                <h3>🏆 Kho chứng nhận ({certificates.length})</h3>
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
        marginBottom: '30px'
    },
    backButton: {
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    profileCard: {
        display: 'flex',
        gap: '30px',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        marginBottom: '30px',
        alignItems: 'center'
    },
    avatar: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: '#007bff',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '48px',
        fontWeight: 'bold'
    },
    userInfo: {
        flex: 1
    },
    email: {
        color: '#666',
        marginBottom: '10px'
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
        color: '#333'
    },
    progressBar: {
        height: '10px',
        backgroundColor: '#e9ecef',
        borderRadius: '5px',
        overflow: 'hidden',
        marginBottom: '10px'
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#007bff',
        transition: 'width 0.5s'
    },
    streak: {
        fontSize: '14px',
        color: '#fd7e14'
    },
    statsSection: {
        marginBottom: '30px'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        marginTop: '15px'
    },
    statCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center'
    },
    statValue: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: '5px'
    },
    statLabel: {
        fontSize: '13px',
        color: '#666'
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
        color: '#666',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px'
    }
};

export default ProfilePage;