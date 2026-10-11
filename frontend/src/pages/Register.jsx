import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getPasswordStrength = (password) => {
        if (!password) return { level: 0, label: '', color: '#E9ECEF' };

        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        if (score <= 2) return { level: 1, label: 'Yếu', color: '#DC3545' };
        if (score <= 3) return { level: 2, label: 'Trung bình', color: '#FFC107' };
        if (score <= 4) return { level: 3, label: 'Mạnh', color: '#28A745' };
        return { level: 4, label: 'Rất mạnh', color: '#20C997' };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!agreeTerms) {
            setError('Vui lòng đồng ý với Điều khoản sử dụng và Chính sách bảo mật');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setLoading(true);

        try {
            await register(formData.username, formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Đăng ký thất bại');
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
                    <h2 style={styles.subtitle}>Đăng ký tài khoản</h2>

                    {error && <div style={styles.error}>{error}</div>}

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Tên người dùng</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Nhập tên của bạn"
                                value={formData.username}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Nhập email của bạn"
                                value={formData.email}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Mật khẩu</label>
                            <div style={styles.passwordWrapper}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Nhập mật khẩu"
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={styles.passwordInput}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={styles.eyeButton}
                                    tabIndex={-1}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {formData.password && (
                                <div style={styles.strengthWrapper}>
                                    <div style={styles.strengthBar}>
                                        <div style={{
                                            ...styles.strengthFill,
                                            width: `${passwordStrength.level * 25}%`,
                                            backgroundColor: passwordStrength.color
                                        }} />
                                    </div>
                                    <span style={{ ...styles.strengthLabel, color: passwordStrength.color }}>
                                        {passwordStrength.label}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Xác nhận mật khẩu</label>
                            <div style={styles.passwordWrapper}>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    placeholder="Nhập lại mật khẩu"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    style={styles.passwordInput}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={styles.eyeButton}
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <label style={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                style={styles.checkbox}
                            />
                            <span>
                                Tôi đồng ý với{' '}
                                <Link to="/terms" style={styles.link}>Điều khoản sử dụng</Link>
                                {' '}và{' '}
                                <Link to="/privacy" style={styles.link}>Chính sách bảo mật</Link>
                            </span>
                        </label>

                        <button type="submit" style={styles.button} disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'Đăng ký tài khoản'}
                        </button>
                    </form>

                    <p style={styles.loginText}>
                        Đã có tài khoản?{' '}
                        <Link to="/login" style={styles.loginLink}>Đăng nhập ngay</Link>
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
        alignItems: 'center',
        padding: '32px 0'
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
        maxWidth: '460px',
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
        backgroundColor: '#F8F9FA',
        width: '100%',
        boxSizing: 'border-box'
    },
    passwordWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    passwordInput: {
        padding: '12px 48px 12px 16px',
        border: '1px solid #CED4DA',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.25s ease',
        backgroundColor: '#F8F9FA',
        width: '100%',
        boxSizing: 'border-box'
    },
    eyeButton: {
        position: 'absolute',
        right: '12px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        padding: '4px',
        opacity: 0.7,
        transition: 'opacity 0.2s'
    },
    strengthWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginTop: '6px'
    },
    strengthBar: {
        flex: 1,
        height: '6px',
        backgroundColor: '#E9ECEF',
        borderRadius: '3px',
        overflow: 'hidden'
    },
    strengthFill: {
        height: '100%',
        transition: 'all 0.3s ease',
        borderRadius: '3px'
    },
    strengthLabel: {
        fontSize: '12px',
        fontWeight: '600',
        minWidth: '70px',
        textAlign: 'right'
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        fontSize: '13px',
        color: '#495057',
        lineHeight: '1.5',
        cursor: 'pointer',
        marginTop: '4px'
    },
    checkbox: {
        marginTop: '3px',
        cursor: 'pointer',
        width: '16px',
        height: '16px',
        flexShrink: 0
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
    link: {
        color: '#0D6EFD',
        fontWeight: '600',
        textDecoration: 'none'
    },
    loginText: {
        textAlign: 'center',
        fontSize: '14px',
        color: '#6C757D',
        marginTop: '24px',
        marginBottom: 0
    },
    loginLink: {
        color: '#0D6EFD',
        fontWeight: '600',
        textDecoration: 'none'
    }
};

export default Register;