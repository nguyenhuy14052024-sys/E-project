import React from 'react';

const CertificateBadge = ({ certificate }) => {
    const getLabel = (type) => {
        switch (type) {
            case 'unit': return 'UNIT';
            case 'course': return 'KHÓA HỌC';
            case 'mini_test': return 'MINI TEST';
            case 'streak': return 'STREAK';
            case 'flashcard': return 'FLASHCARD';
            case 'error_log': return 'LỖI SAI';
            default: return 'CHỨNG NHẬN';
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'unit': return '#0D6EFD';
            case 'course': return '#28A745';
            case 'mini_test': return '#6F42C1';
            case 'streak': return '#FD7E14';
            case 'flashcard': return '#20C997';
            case 'error_log': return '#DC3545';
            default: return '#6C757D';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div style={{ ...styles.card, borderTopColor: getColor(certificate.type) }}>
            <div style={styles.header}>
                <span style={{ ...styles.label, backgroundColor: getColor(certificate.type) }}>
                    {getLabel(certificate.type)}
                </span>
            </div>

            <div style={styles.body}>
                <h3 style={styles.title}>{certificate.title}</h3>
                {certificate.description && (
                    <p style={styles.description}>{certificate.description}</p>
                )}
            </div>

            <div style={styles.footer}>
                <div style={styles.footerItem}>
                    <span style={styles.footerLabel}>Ngày nhận</span>
                    <span style={styles.footerValue}>{formatDate(certificate.earned_at)}</span>
                </div>
                <div style={styles.footerItem}>
                    <span style={styles.footerLabel}>Mã số</span>
                    <span style={styles.footerCode}>{certificate.code}</span>
                </div>
            </div>
        </div>
    );
};

const styles = {
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        borderRadius: '12px',
        border: '2px solid #DCE8F5',
        borderTop: '4px solid #0D6EFD',
        boxShadow: '0 2px 12px rgba(13, 110, 253, 0.06)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },
    header: {
        padding: '16px 20px 0 20px'
    },
    label: {
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '20px',
        color: '#FFFFFF',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '0.8px',
        textTransform: 'uppercase'
    },
    body: {
        padding: '16px 20px',
        flex: 1
    },
    title: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#212529',
        margin: '0 0 8px 0',
        lineHeight: '1.4'
    },
    description: {
        fontSize: '13px',
        color: '#6C757D',
        lineHeight: '1.5',
        margin: 0
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        backgroundColor: '#F6F9FE',
        borderTop: '1px solid #DCE8F5',
        gap: '12px',
        flexWrap: 'wrap'
    },
    footerItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    },
    footerLabel: {
        fontSize: '10px',
        color: '#6C757D',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontWeight: '600'
    },
    footerValue: {
        fontSize: '13px',
        color: '#212529',
        fontWeight: '600'
    },
    footerCode: {
        fontSize: '11px',
        color: '#6C757D',
        fontFamily: 'monospace',
        fontWeight: '500'
    }
};

export default CertificateBadge;