import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllLevelTests } from '../services/levelTestService';

const LevelTestList = () => {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLevel, setSelectedLevel] = useState('B2');

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        setLoading(true);
        try {
            const data = await getAllLevelTests();
            setTests(data.tests || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredTests = tests.filter(t => t.book_level === selectedLevel);

    if (loading) return <div>Đang tải...</div>;

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
                    ← Về Dashboard
                </button>
                <h1 style={styles.title}>Level Test</h1>
                <p style={styles.subtitle}>Chọn bài test để kiểm tra trình độ</p>

                <div style={styles.levelSelector}>
                    {['A1', 'A2', 'B1', 'B2', 'C1'].map(level => (
                        <button
                            key={level}
                            style={{
                                ...styles.levelButton,
                                ...(selectedLevel === level ? styles.activeLevel : {})
                            }}
                            onClick={() => setSelectedLevel(level)}
                        >
                            {level}
                        </button>
                    ))}
                </div>

                {filteredTests.length === 0 ? (
                    <div style={styles.emptyState}>
                        Chưa có bài test nào cho trình độ {selectedLevel}
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {filteredTests.map(test => (
                            <div key={test.id} style={styles.card}>
                                <span style={styles.levelBadge}>{test.book_level}</span>
                                <h3 style={styles.cardTitle}>{test.title}</h3>
                                <p style={styles.cardDesc}>{test.description}</p>
                                <div style={styles.meta}>
                                    <span>{test.duration} phút</span>
                                    <span>{test.total_score} điểm</span>
                                    <span style={{ fontWeight: '600', color: test.questionCount > 0 ? '#28A745' : '#DC3545' }}>
    {test.questionCount || 0} câu
</span>
                                </div>
                                <button
                                    onClick={() => navigate(`/level-test/${test.id}`)}
                                    style={styles.startButton}
                                >
                                    Bắt đầu làm bài
                                </button>
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
        fontFamily: "'Inter', 'Roboto', sans-serif",
        padding: '40px 20px'
    },
    container: {
        maxWidth: '1000px',
        margin: '0 auto'
    },
    backButton: {
        padding: '8px 16px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        color: '#495057',
        border: '1px solid #DCE8F5',
        borderRadius: '8px',
        cursor: 'pointer',
        marginBottom: '24px',
        fontSize: '14px'
    },
    title: {
        fontSize: '32px',
        fontWeight: '800',
        color: '#0D6EFD',
        marginBottom: '8px',
        textAlign: 'center'
    },
    subtitle: {
        fontSize: '15px',
        color: '#6C757D',
        textAlign: 'center',
        marginBottom: '32px'
    },
    levelSelector: {
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    levelButton: {
        padding: '10px 24px',
        backgroundColor: '#E9ECEF',
        border: '2px solid transparent',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        color: '#495057'
    },
    activeLevel: {
        backgroundColor: '#0D6EFD',
        color: 'white',
        borderColor: '#0D6EFD'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
    },
    card: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        border: '2px solid #DCE8F5',
        boxShadow: '0 2px 12px rgba(13, 110, 253, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    levelBadge: {
        display: 'inline-block',
        padding: '3px 10px',
        backgroundColor: '#0D6EFD',
        color: 'white',
        borderRadius: '3px',
        fontSize: '12px',
        fontWeight: '700',
        width: 'fit-content'
    },
    cardTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#212529',
        margin: 0
    },
    cardDesc: {
        fontSize: '14px',
        color: '#6C757D',
        margin: 0,
        flex: 1
    },
    meta: {
        display: 'flex',
        gap: '12px',
        fontSize: '12px',
        color: '#6C757D',
        flexWrap: 'wrap'
    },
    startButton: {
        padding: '10px',
        backgroundColor: '#0D6EFD',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '8px'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px',
        color: '#6C757D',
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '2px dashed #DCE8F5'
    }
};

export default LevelTestList;