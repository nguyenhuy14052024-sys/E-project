import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.bgShape1}></div>
            <div style={styles.bgShape2}></div>
            <div style={styles.bgGrid}></div>

            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={styles.logoWrapper}>
                        <span style={styles.logoBadge}></span>
                        <h1 style={styles.title}>EnglishIngLesh</h1>
                    </div>
                    <h2 style={styles.subtitle}>Đăng nhập</h2>

                    {error && <div style={styles.error}>{error}</div>}

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email</label>
                            <input
                                type="email"
                                placeholder="Nhập email của bạn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Mật khẩu</label>
                            <input
                                type="password"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>
                        <button type="submit" style={styles.button} disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                        </button>
                    </form>

                    <div style={styles.footerLinks}>
                        <Link to="/forgot-password" style={styles.link}>
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <p style={styles.registerText}>
                        Chưa có tài khoản?{' '}
                        <Link to="/register" style={styles.registerLink}>
                            Đăng ký ngay
                        </Link>
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
    bgShape1: {
        position: 'fixed',
        top: '-180px',
        right: '-180px',
        width: '520px',
        height: '520px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13, 110, 253, 0.15) 0%, rgba(13, 110, 253, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
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
        zIndex: 0
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
        width: '100%',
        maxWidth: '440px',
        padding: '32px',
        position: 'relative',
        zIndex: 1
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '40px 36px',
        borderRadius: '16px',
        border: '2px solid #DCE8F5',
        boxShadow: '0 8px 32px rgba(13, 110, 253, 0.10)'
    },
    logoWrapper: {
        textAlign: 'center',
        marginBottom: '16px'
    },
    logoBadge: {
        display: 'inline-block',
        fontSize: '36px',
        marginBottom: '4px'
    },
    title: {
        fontSize: '24px',
        fontWeight: '800',
        color: '#0D6EFD',
        margin: 0,
        letterSpacing: '-0.5px'
    },
    subtitle: {
        textAlign: 'center',
        fontSize: '20px',
        fontWeight: '700',
        color: '#212529',
        margin: '0 0 24px 0'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#495057'
    },
    input: {
        padding: '12px 16px',
        border: '1px solid #CED4DA',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.25s ease',
        backgroundColor: '#F8F9FA'
    },
    button: {
        padding: '14px',
        backgroundColor: '#0D6EFD',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(13, 110, 253, 0.35)',
        transition: 'all 0.25s ease',
        marginTop: '8px'
    },
    error: {
        backgroundColor: '#F8D7DA',
        color: '#721C24',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '14px'
    },
    footerLinks: {
        textAlign: 'right',
        marginTop: '12px'
    },
    link: {
        fontSize: '13px',
        color: '#0D6EFD',
        textDecoration: 'none',
        fontWeight: '500'
    },
    registerText: {
        textAlign: 'center',
        fontSize: '14px',
        color: '#6C757D',
        marginTop: '24px',
        marginBottom: 0
    },
    registerLink: {
        color: '#0D6EFD',
        fontWeight: '600',
        textDecoration: 'none'
    }
};

export default Login;