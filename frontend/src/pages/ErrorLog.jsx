import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getErrorLog } from '../services/unitService';
import { getUnits } from '../services/unitService';

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
        return <div style={styles.container}>Đang tải danh sách lỗi sai...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}> Kho lỗi sai</h1>
            <p style={styles.subtitle}>Tổng số câu sai: <strong>{totalCount}</strong></p>

            {/* Thống kê theo Unit */}
            {unitStats.length > 0 && (
                <div style={styles.statsContainer}>
                    <h3>Thống kê theo Unit:</h3>
                    <div style={styles.statsGrid}>
                        {unitStats.map(stat => (
                            <div key={stat.unitId} style={styles.statCard}>
                                <span style={styles.statUnit}>Unit {stat.unitNumber}: {stat.unitTitle}</span>
                                <span style={styles.statCount}>{stat.errorCount} câu sai</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Bộ lọc theo Unit */}
            <div style={styles.filterContainer}>
                <label>Lọc theo Unit:</label>
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

            {/* Danh sách lỗi sai */}
            {errors.length === 0 ? (
                <div style={styles.emptyState}>
                    <p>🎉 Chưa có lỗi sai nào! Bạn đang học rất tốt!</p>
                </div>
            ) : (
                <div style={styles.errorList}>
                    {errors.map((error, index) => (
                        <div key={error.id} style={styles.errorCard}>
                            <div style={styles.errorHeader} onClick={() => toggleExpand(index)}>
                                <div>
                                    <span style={styles.errorUnit}>Unit {getUnitTitle(error.unitId)}</span>
                                    <span style={styles.errorType}>{error.questionType.replace('_', ' ').toUpperCase()}</span>
                                </div>
                                <span style={styles.errorAnswer}>
                                    Đáp án của bạn: <strong style={{ color: '#dc3545' }}>{error.userAnswer || '(bỏ trống)'}</strong>
                                </span>
                                <span style={styles.expandIcon}>
                                    {expandedError === index ? '▲' : '▼'}
                                </span>
                            </div>
                            <div style={styles.errorContent}>
                                <p><strong>Câu hỏi:</strong> {error.content}</p>
                                {expandedError === index && (
                                    <div style={styles.errorDetail}>
                                        <p><strong>Đáp án đúng:</strong> <span style={{ color: '#28a745' }}>{error.correctAnswer}</span></p>
                                        {error.explanation && (
                                            <p><strong>Giải thích:</strong> {error.explanation}</p>
                                        )}
                                        {error.options && (
                                            <div>
                                                <strong>Các lựa chọn:</strong>
                                                <ul>
                                                    {error.options.map((opt, i) => (
                                                        <li key={i}>{opt}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        <button
                                            style={styles.reviewButton}
                                            onClick={() => navigate(`/practice/${error.unitId}`)}
                                        >
                                            Ôn lại
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
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
    title: {
        textAlign: 'center',
        color: '#333'
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        marginBottom: '30px'
    },
    statsContainer: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '10px',
        marginTop: '10px'
    },
    statCard: {
        backgroundColor: 'white',
        padding: '10px 15px',
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    statUnit: {
        fontSize: '14px'
    },
    statCount: {
        fontWeight: 'bold',
        color: '#dc3545'
    },
    filterContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
    },
    filterSelect: {
        padding: '8px 16px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '14px',
        flex: 1
    },
    emptyState: {
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#d4edda',
        borderRadius: '10px',
        color: '#155724'
    },
    errorList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    errorCard: {
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
    },
    errorHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        cursor: 'pointer',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #eee'
    },
    errorUnit: {
        fontSize: '12px',
        color: '#666',
        marginRight: '10px'
    },
    errorType: {
        fontSize: '12px',
        backgroundColor: '#e9ecef',
        padding: '2px 8px',
        borderRadius: '3px'
    },
    errorAnswer: {
        fontSize: '14px'
    },
    expandIcon: {
        fontSize: '12px',
        color: '#666'
    },
    errorContent: {
        padding: '15px 20px'
    },
    errorDetail: {
        marginTop: '10px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '5px'
    },
    reviewButton: {
        padding: '8px 16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px'
    }
};

export default ErrorLog;