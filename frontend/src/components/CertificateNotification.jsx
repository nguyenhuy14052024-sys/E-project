import React, { useEffect, useState } from 'react';

const CertificateNotification = ({ certificate, onClose, onViewProfile }) => {
    const [visible, setVisible] = useState(false);
    const [confetti, setConfetti] = useState([]);

    useEffect(() => {
        setTimeout(() => setVisible(true), 100);

        // Tạo confetti
        const pieces = [];
        for (let i = 0; i < 50; i++) {
            pieces.push({
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 0.5,
                duration: 2 + Math.random() * 2,
                color: ['#0D6EFD', '#28A745', '#FD7E14', '#6F42C1', '#FFC107'][Math.floor(Math.random() * 5)]
            });
        }
        setConfetti(pieces);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    if (!certificate) return null;

    return (
        <>
            {/* Confetti */}
            <div style={styles.confettiContainer}>
                {confetti.map(piece => (
                    <div
                        key={piece.id}
                        style={{
                            ...styles.confettiPiece,
                            left: `${piece.left}%`,
                            backgroundColor: piece.color,
                            animationDelay: `${piece.delay}s`,
                            animationDuration: `${piece.duration}s`
                        }}
                    />
                ))}
            </div>

            {/* Overlay */}
            <div
                style={{
                    ...styles.overlay,
                    opacity: visible ? 1 : 0
                }}
                onClick={handleClose}
            >
                <div
                    style={{
                        ...styles.modal,
                        transform: visible ? 'scale(1)' : 'scale(0.8)',
                        opacity: visible ? 1 : 0
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div style={styles.iconWrapper}>
                        <div style={styles.iconCircle}>
                            <span style={styles.iconText}>✓</span>
                        </div>
                    </div>

                    <h2 style={styles.title}>Chúc mừng!</h2>
                    <p style={styles.subtitle}>Bạn đã nhận được chứng nhận mới</p>

                    <div style={styles.certificateBox}>
                        <span style={styles.certLabel}>CHỨNG NHẬN</span>
                        <h3 style={styles.certTitle}>{certificate.title}</h3>
                        {certificate.description && (
                            <p style={styles.certDesc}>{certificate.description}</p>
                        )}
                        <p style={styles.certCode}>Mã: {certificate.code}</p>
                    </div>

                    <div style={styles.buttonGroup}>
                        <button onClick={onViewProfile} style={styles.primaryButton}>
                            Xem chứng nhận
                        </button>
                        <button onClick={handleClose} style={styles.secondaryButton}>
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

const styles = {
    confettiContainer: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 9998,
        overflow: 'hidden'
    },
    confettiPiece: {
        position: 'absolute',
        top: '-20px',
        width: '10px',
        height: '10px',
        borderRadius: '2px',
        animation: 'confettiFall linear forwards'
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        transition: 'opacity 0.3s ease',
        padding: '20px'
    },
    modal: {
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '40px 32px',
        maxWidth: '420px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(13, 110, 253, 0.25)',
        transition: 'all 0.3s ease',
        border: '2px solid #DCE8F5'
    },
    iconWrapper: {
        marginBottom: '16px'
    },
    iconCircle: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#28A745',
        boxShadow: '0 8px 24px rgba(40, 167, 69, 0.35)',
        animation: 'pulse 2s ease-in-out infinite'
    },
    iconText: {
        fontSize: '40px',
        color: '#FFFFFF',
        fontWeight: '700'
    },
    title: {
        fontSize: '26px',
        fontWeight: '800',
        color: '#212529',
        margin: '0 0 8px 0'
    },
    subtitle: {
        fontSize: '15px',
        color: '#6C757D',
        margin: '0 0 24px 0'
    },
    certificateBox: {
        backgroundColor: '#F6F9FE',
        border: '2px solid #DCE8F5',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        textAlign: 'left'
    },
    certLabel: {
        display: 'inline-block',
        padding: '3px 10px',
        backgroundColor: '#0D6EFD',
        color: '#FFFFFF',
        borderRadius: '20px',
        fontSize: '10px',
        fontWeight: '700',
        letterSpacing: '0.8px',
        marginBottom: '10px'
    },
    certTitle: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#212529',
        margin: '0 0 6px 0'
    },
    certDesc: {
        fontSize: '13px',
        color: '#6C757D',
        margin: '0 0 8px 0',
        lineHeight: '1.5'
    },
    certCode: {
        fontSize: '11px',
        color: '#6C757D',
        fontFamily: 'monospace',
        margin: 0
    },
    buttonGroup: {
        display: 'flex',
        gap: '12px'
    },
    primaryButton: {
        flex: 1,
        padding: '12px',
        backgroundColor: '#0D6EFD',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(13, 110, 253, 0.35)',
        transition: 'all 0.25s ease'
    },
    secondaryButton: {
        flex: 1,
        padding: '12px',
        backgroundColor: '#F8F9FA',
        color: '#495057',
        border: '1px solid #CED4DA',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.25s ease'
    }
};

// Inject keyframes
if (typeof document !== 'undefined') {
    const existing = document.getElementById('certificate-keyframes');
    if (!existing) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'certificate-keyframes';
        styleSheet.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.08); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

export default CertificateNotification;