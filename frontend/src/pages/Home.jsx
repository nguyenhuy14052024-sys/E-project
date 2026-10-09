import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

const Home = () => {
    const isLoggedIn = isAuthenticated();

    return (
        <div style={styles.page}>
            {/* Background shapes */}
            <div style={styles.bgShape1}></div>
            <div style={styles.bgShape2}></div>
            <div style={styles.bgShape3}></div>
            <div style={styles.bgShape4}></div>
            <div style={styles.bgGrid}></div>

            <div style={styles.container}>
                <div style={styles.content}>
                    {/* Logo / Title */}
                    <div style={styles.logoWrapper}>
                        <span style={styles.logoBadge}></span>
                        <h1 style={styles.title}>EnglishIngLesh</h1>
                        <p style={styles.tagline}>Học tiếng Anh, chinh phục mọi giới hạn</p>
                    </div>

                    <p style={styles.subtitle}>
                        Nền tảng học tiếng Anh trực tuyến dành cho người tự học.
                        Ôn luyện ngữ pháp, từ vựng và theo dõi tiến độ của bạn.
                    </p>

                    {/* Features */}
                    <div style={styles.features}>
                        <div style={styles.feature}>
                            <div style={styles.featureIcon}>A</div>
                            <h3 style={styles.featureTitle}>Lý thuyết chi tiết</h3>
                            <p style={styles.featureDesc}>Nội dung bài học được biên soạn theo từng Unit.</p>
                        </div>
                        <div style={styles.feature}>
                            <div style={styles.featureIcon}>B</div>
                            <h3 style={styles.featureTitle}>Bài tập đa dạng</h3>
                            <p style={styles.featureDesc}>6 loại câu hỏi, chấm điểm tự động, phản hồi ngay.</p>
                        </div>
                        <div style={styles.feature}>
                            <div style={styles.featureIcon}>C</div>
                            <h3 style={styles.featureTitle}>Kho lỗi sai</h3>
                            <p style={styles.featureDesc}>Lưu lại câu sai, xem giải thích và ôn lại.</p>
                        </div>
                        <div style={styles.feature}>
                            <div style={styles.featureIcon}>D</div>
                            <h3 style={styles.featureTitle}>Flashcard thông minh</h3>
                            <p style={styles.featureDesc}>Ôn tập từ vựng theo thuật toán spaced repetition.</p>
                        </div>
                    </div>

                    {/* CTA */}
                    <Link to={isLoggedIn ? '/dashboard' : '/login'} style={styles.button}>
                        {isLoggedIn ? 'Vào học ngay' : 'Bắt đầu ngay'}
                    </Link>

                    <p style={styles.footerNote}>
                        Miễn phí sử dụng. Không cần thẻ tín dụng.
                    </p>
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    // Background shapes
    bgShape1: {
        position: 'fixed',
        top: '-180px',
        right: '-180px',
        width: '520px',
        height: '520px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13, 110, 253, 0.15) 0%, rgba(13, 110, 253, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'float 12s ease-in-out infinite'
    },
    bgShape2: {
        position: 'fixed',
        bottom: '-200px',
        left: '-150px',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13, 110, 253, 0.10) 0%, rgba(13, 110, 253, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'float 14s ease-in-out infinite reverse'
    },
    bgShape3: {
        position: 'fixed',
        top: '20%',
        left: '5%',
        width: '200px',
        height: '200px',
        borderRadius: '40px',
        border: '3px solid rgba(13, 110, 253, 0.10)',
        transform: 'rotate(25deg)',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'float 10s ease-in-out infinite'
    },
    bgShape4: {
        position: 'fixed',
        bottom: '15%',
        right: '8%',
        width: '160px',
        height: '160px',
        borderRadius: '30px',
        border: '3px solid rgba(13, 110, 253, 0.08)',
        transform: 'rotate(-15deg)',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'float 11s ease-in-out infinite reverse'
    },
    bgGrid: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
            linear-gradient(rgba(13, 110, 253, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13, 110, 253, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
        zIndex: 0
    },
    container: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '48px 32px',
        position: 'relative',
        zIndex: 1,
        width: '100%'
    },
    content: {
        textAlign: 'center'
    },
    // Logo
    logoWrapper: {
        marginBottom: '24px'
    },
    logoBadge: {
        display: 'inline-block',
        fontSize: '48px',
        marginBottom: '8px',
        animation: 'pulse 2.5s ease-in-out infinite'
    },
    title: {
        fontSize: '56px',
        fontWeight: '800',
        color: '#0D6EFD',
        margin: '0 0 8px 0',
        letterSpacing: '-1.5px',
        textShadow: '0 4px 16px rgba(13, 110, 253, 0.25)',
        background: 'linear-gradient(135deg, #0D6EFD 0%, #4D9BFF 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    tagline: {
        fontSize: '16px',
        fontWeight: '500',
        color: '#6C757D',
        margin: 0,
        letterSpacing: '0.5px'
    },
    subtitle: {
        fontSize: '18px',
        color: '#495057',
        marginBottom: '48px',
        lineHeight: '1.6',
        maxWidth: '640px',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    // Features
    features: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '48px'
    },
    feature: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '28px 20px',
        borderRadius: '16px',
        border: '2px solid #DCE8F5',
        boxShadow: '0 2px 12px rgba(13, 110, 253, 0.06)',
        transition: 'all 0.3s ease',
        textAlign: 'center'
    },
    featureIcon: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: '#0D6EFD',
        color: '#FFFFFF',
        fontSize: '22px',
        fontWeight: '700',
        marginBottom: '16px',
        boxShadow: '0 4px 12px rgba(13, 110, 253, 0.35)'
    },
    featureTitle: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#212529',
        margin: '0 0 8px 0'
    },
    featureDesc: {
        fontSize: '13px',
        color: '#6C757D',
        margin: 0,
        lineHeight: '1.5'
    },
    // CTA
    button: {
        display: 'inline-block',
        padding: '16px 48px',
        backgroundColor: '#0D6EFD',
        color: '#FFFFFF',
        borderRadius: '12px',
        textDecoration: 'none',
        fontSize: '17px',
        fontWeight: '700',
        boxShadow: '0 8px 24px rgba(13, 110, 253, 0.35)',
        transition: 'all 0.25s ease',
        letterSpacing: '0.3px'
    },
    footerNote: {
        marginTop: '20px',
        fontSize: '13px',
        color: '#6C757D'
    }
};

// Inject animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes float {
        0% { transform: translateY(0) rotate(25deg); }
        50% { transform: translateY(-24px) rotate(28deg); }
        100% { transform: translateY(0) rotate(25deg); }
    }
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.15); }
        100% { transform: scale(1); }
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);

export default Home;