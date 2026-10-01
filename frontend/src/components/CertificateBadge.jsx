import React from 'react';

const CertificateBadge = ({ certificate }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'unit': return '📘';
            case 'course': return '🎓';
            case 'mini_test': return '📝';
            case 'streak': return '🔥';
            case 'flashcard': return '🃏';
            case 'error_log': return '✅';
            default: return '🏆';
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'unit': return '#007bff';
            case 'course': return '#28a745';
            case 'mini_test': return '#6f42c1';
            case 'streak': return '#fd7e14';
            case 'flashcard': return '#20c997';
            case 'error_log': return '#dc3545';
            default: return '#6c757d';
        }
    };

    return (
        <div style={{ ...styles.card, borderTop: `4px solid ${getColor(certificate.type)}` }}>
            <div style={styles.icon}>{getIcon(certificate.type)}</div>
            <h3 style={styles.title}>{certificate.title}</h3>
            {certificate.description && (
                <p style={styles.description}>{certificate.description}</p>
            )}
            <p style={styles.date}>
                Ngày nhận: {new Date(certificate.earned_at).toLocaleDateString('vi-VN')}
            </p>
            <p style={styles.code}>Mã: {certificate.code}</p>
        </div>
    );
};

const styles = {
    card: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
        transition: 'transform 0.2s',
        cursor: 'pointer'
    },
    icon: {
        fontSize: '48px',
        marginBottom: '10px'
    },
    title: {
        fontSize: '16px',
        marginBottom: '8px',
        color: '#333'
    },
    description: {
        fontSize: '13px',
        color: '#666',
        marginBottom: '10px'
    },
    date: {
        fontSize: '12px',
        color: '#999',
        marginTop: '10px'
    },
    code: {
        fontSize: '11px',
        color: '#bbb',
        fontFamily: 'monospace',
        marginTop: '5px'
    }
};

export default CertificateBadge;