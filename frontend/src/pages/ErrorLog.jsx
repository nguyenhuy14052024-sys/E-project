import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getErrorLog, getUnits } from '../services/unitService';

const ErrorLog = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [unitStats, setUnitStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUnit, setSelectedUnit] = useState('');
    const [units, setUnits] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [expandedError, setExpandedError] = useState(null);

    useEffect(() => {
        fetchUnits();
        fetchErrors();
    }, [selectedUnit]);

    const fetchUnits = async () => {
        try {
            const data = await getUnits('B2');
            setUnits(data.units || []);
        } catch (error) {
            console.error('Lỗi lấy danh sách Unit:', error);
        }
    };

    const fetchErrors = async () => {
        setLoading(true);
        try {
            const data = await getErrorLog({
                unitId: selectedUnit || undefined,
                limit: 100
            });
            setErrors(data.errors || []);
            setUnitStats(data.unitStats || []);
            setTotalCount(data.totalCount || 0);
        } catch (error) {
            console.error('Lỗi lấy danh sách lỗi sai:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (index) => {
        setExpandedError(expandedError === index ? null : index);
    };

    const getUnitTitle = (unitId) => {
        const unit = units.find(u => u.id === unitId);
        return unit ? unit.title : 'Unknown';
    };

    if (loading) {
        return (
            <div style={styles.page}>
                <div style={styles.container}>
                    <div style={styles.loadingWrapper}>
                        <div style={styles.spinner}></div>
                        <p style={styles.loadingText}>Đang tìm lại lỗi sai...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.bgShape1}></div>
            <div style={styles.bgShape2}></div>

            <div style={styles.container}>
                <div style={styles.header}>
                    <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
                        ← Về Dashboard
                    </button>
                </div>

                <div style={styles.titleSection}>
                    <h1 style={styles.title}>Kho lỗi sai</h1>
                    <p style={styles.subtitle}>
                        Tổng số câu sai: <strong>{totalCount}</strong>
                    </p>
                </div>

                {unitStats.length > 0 && (
                    <div style={styles.statsSection}>
                        <h3 style={styles.sectionTitle}>Thống kê theo Unit</h3>
                        <div style={styles.statsGrid}>
                            {unitStats.map(stat => (
                                <div key={stat.unitId} style={styles.statCard}>
                                    <span style={styles.statUnit}>
                                        Unit {stat.unitNumber}: {stat.unitTitle}
                                    </span>
                                    <span style={styles.statCount}>{stat.errorCount} câu sai</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={styles.filterCard}>
                    <label style={styles.filterLabel}>Lọc theo Unit:</label>
                    <select
                        value={selectedUnit}
                        onChange={(e) => setSelectedUnit(e.target.value)}
                        style={styles.filterSelect}
                    >
                        <option value="">Tất cả</option>
                        {units.map(unit => (
                            <option key={unit.id} value={unit.id}>
                                Unit {unit.unit_number}: {unit.title}
                            </option>
                        ))}
                    </select>
                </div>

                {errors.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p style={styles.emptyTitle}>Chưa có lỗi sai nào</p>
                        <p style={styles.emptyText}>Bạn đang học rất tốt!</p>
                    </div>
                ) : (
                    <div style={styles.errorList}>
                        {errors.map((error, index) => (
                            <div key={error.id} style={styles.errorCard}>
                                <div 
                                    style={styles.errorHeader} 
                                    onClick={() => toggleExpand(index)}
                                >
                                    <div style={styles.errorHeaderLeft}>
                                        <span style={styles.errorUnit}>
                                            {getUnitTitle(error.unitId)}
                                        </span>
                                        <span style={styles.errorType}>
                                            {error.questionType.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                    <div style={styles.errorHeaderRight}>
                                        <span style={styles.errorAnswer}>
                                            Đáp án của bạn:{' '}
                                            <strong style={{ color: '#DC3545' }}>
                                                {error.userAnswer || '(bỏ trống)'}
                                            </strong>
                                        </span>
                                        <span style={styles.expandIcon}>
                                            {expandedError === index ? '−' : '+'}
                                        </span>
                                    </div>
                                </div>

                                <div style={styles.errorContent}>
                                    <p style={styles.questionText}>
                                        <strong>Câu hỏi:</strong> {error.content}
                                    </p>

                                    {expandedError === index && (
                                        <div style={styles.errorDetail}>
                                            <p style={styles.detailLine}>
                                                <span style={styles.detailLabel}>Đáp án đúng:</span>{' '}
                                                <strong style={{ color: '#28A745' }}>
                                                    {error.correctAnswer}
                                                </strong>
                                            </p>
                                            {error.explanation && (
                                                <p style={styles.detailLine}>
                                                    <span style={styles.detailLabel}>Giải thích:</span>{' '}
                                                    {error.explanation}
                                                </p>
                                            )}
                                            {error.options && (
                                                <div style={styles.optionsBox}>
                                                    <p style={styles.detailLabel}>Các lựa chọn:</p>
                                                    <ul style={styles.optionsList}>
                                                        {error.options.map((opt, i) => (
                                                            <li key={i} style={styles.optionItem}>{opt}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            <button
                                                style={styles.reviewButton}
                                                onClick={() => navigate(`/practice/${error.unitId}`)}
                                            >
                                                Ôn lại Unit này
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
        padding: '32px 24px'
    },
    bgShape1: {
        position: 'fixed',
        top: '-180px',
        right: '-180px',
        width: '520px',
        height: '520px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(220, 53, 69, 0.10) 0%, rgba(220, 53, 69, 0) 70%)',
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
        background: 'radial-gradient(circle, rgba(13, 110, 253, 0.08) 0%, rgba(13, 110, 253, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
    },
    container: {
        maxWidth: '900px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
    },
    header: {
        marginBottom: '24px'
    },
    backButton: {
        padding: '8px 16px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        color: '#495057',
        border: '1px solid #DCE8F5',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500'
    },
    titleSection: {
        textAlign: 'center',
        marginBottom: '32px'
    },
    title: {
        fontSize: '36px',
        fontWeight: '800',
        color: '#0D6EFD',
        margin: '0 0 8px 0'
    },
    subtitle: {
        fontSize: '15px',
        color: '#6C757D',
        margin: 0
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#212529',
        marginBottom: '12px'
    },
    statsSection: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '24px',
        borderRadius: '12px',
        border: '2px solid #DCE8F5',
        boxShadow: '0 2px 12px rgba(13, 110, 253, 0.06)',
        marginBottom: '20px'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '12px'
    },
    statCard: {
        backgroundColor: '#F6F9FE',
        padding: '12px 16px',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid #DCE8F5'
    },
    statUnit: {
        fontSize: '14px',
        color: '#495057',
        fontWeight: '500'
    },
    statCount: {
        fontWeight: '700',
        color: '#DC3545',
        fontSize: '14px'
    },
    filterCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 20px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderRadius: '12px',
        border: '2px solid #DCE8F5',
        boxShadow: '0 2px 12px rgba(13, 110, 253, 0.06)',
        marginBottom: '20px'
    },
    filterLabel: {
        fontWeight: '600',
        fontSize: '14px',
        color: '#495057',
        whiteSpace: 'nowrap'
    },
    filterSelect: {
        padding: '10px 16px',
        borderRadius: '8px',
        border: '1px solid #CED4DA',
        fontSize: '14px',
        backgroundColor: '#F8F9FA',
        cursor: 'pointer',
        flex: 1,
        outline: 'none'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 40px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderRadius: '16px',
        border: '2px solid #DCE8F5'
    },
    emptyTitle: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#28A745',
        margin: '0 0 8px 0'
    },
    emptyText: {
        fontSize: '15px',
        color: '#6C757D',
        margin: 0
    },
    errorList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    errorCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderRadius: '12px',
        border: '2px solid #DCE8F5',
        boxShadow: '0 2px 12px rgba(13, 110, 253, 0.06)',
        overflow: 'hidden',
        transition: 'all 0.25s ease'
    },
    errorHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        cursor: 'pointer',
        backgroundColor: '#F8F9FA',
        borderBottom: '1px solid #DCE8F5',
        gap: '12px',
        flexWrap: 'wrap'
    },
    errorHeaderLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    errorHeaderRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    errorUnit: {
        fontSize: '13px',
        color: '#6C757D',
        fontWeight: '500'
    },
    errorType: {
        fontSize: '11px',
        backgroundColor: '#E7F1FF',
        color: '#0D6EFD',
        padding: '4px 10px',
        borderRadius: '20px',
        fontWeight: '600',
        letterSpacing: '0.5px'
    },
    errorAnswer: {
        fontSize: '13px',
        color: '#495057'
    },
    expandIcon: {
        fontSize: '20px',
        color: '#0D6EFD',
        fontWeight: '700',
        width: '24px',
        textAlign: 'center'
    },
    errorContent: {
        padding: '16px 20px'
    },
    questionText: {
        fontSize: '15px',
        color: '#212529',
        margin: 0,
        lineHeight: '1.6'
    },
    errorDetail: {
        marginTop: '16px',
        padding: '16px',
        backgroundColor: '#F6F9FE',
        borderRadius: '8px',
        border: '1px solid #DCE8F5'
    },
    detailLine: {
        fontSize: '14px',
        color: '#495057',
        margin: '0 0 10px 0',
        lineHeight: '1.6'
    },
    detailLabel: {
        fontWeight: '600',
        color: '#212529'
    },
    optionsBox: {
        marginTop: '12px',
        padding: '12px',
        backgroundColor: '#FFFFFF',
        borderRadius: '6px',
        border: '1px solid #DCE8F5'
    },
    optionsList: {
        margin: '8px 0 0 0',
        paddingLeft: '20px'
    },
    optionItem: {
        fontSize: '13px',
        color: '#495057',
        marginBottom: '4px'
    },
    reviewButton: {
        padding: '10px 20px',
        backgroundColor: '#0D6EFD',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        marginTop: '12px',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 2px 6px rgba(13, 110, 253, 0.25)'
    },
    loadingWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px',
        gap: '20px'
    },
    spinner: {
        width: '48px',
        height: '48px',
        border: '4px solid #DCE8F5',
        borderTop: '4px solid #0D6EFD',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
    },
    loadingText: {
        color: '#6C757D',
        fontSize: '15px',
        fontWeight: '500',
        margin: 0
    }
};

if (typeof document !== 'undefined') {
    const existing = document.getElementById('errorlog-keyframes');
    if (!existing) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'errorlog-keyframes';
        styleSheet.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

export default ErrorLog;