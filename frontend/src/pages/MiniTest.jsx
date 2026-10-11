import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateMiniTest, submitQuiz } from '../services/unitService';

const MiniTest = () => {
    const navigate = useNavigate();
    const [options, setOptions] = useState({
        level: 'B2',
        count: 5,
        questionTypes: []
    });
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const questionTypeOptions = [
        { value: 'multiple_choice', label: 'Trắc nghiệm' },
        { value: 'gap_filling', label: 'Điền từ' },
        { value: 'word_formation', label: 'Biến đổi từ' },
        { value: 'sentence_transformation', label: 'Viết lại câu' },
        { value: 'error_correction', label: 'Sửa lỗi' },
        { value: 'collocation', label: 'Collocations' }
    ];

    const handleGenerate = async () => {
        setLoading(true);
        setError('');
        setSubmitted(false);
        try {
            const data = await generateMiniTest(options);
            setQuestions(data.questions || []);
        } catch (err) {
            setError(err.message || 'Lỗi tạo Mini Test');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const handleSubmit = async () => {
        if (questions.length === 0) return;
        
        const answerList = Object.entries(answers).map(([questionId, userAnswer]) => ({
            questionId,
            userAnswer
        }));

        try {
            const unitId = questions[0]?.unit_id;
            const data = await submitQuiz(unitId, answerList);
            setResult(data);
            setSubmitted(true);
        } catch (err) {
            setError('Lỗi nộp bài');
        }
    };

    const getScoreColor = (score) => {
        if (score >= 90) return '#28A745';
        if (score >= 70) return '#17A2B8';
        if (score >= 50) return '#FFC107';
        return '#DC3545';
    };

    if (loading) {
        return (
            <div style={styles.page}>
                <div style={styles.container}>
                    <div style={styles.loadingWrapper}>
                        <div style={styles.spinner}></div>
                        <p style={styles.loadingText}>Đang tạo bài test...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (submitted && result) {
        return (
            <div style={styles.page}>
                <div style={styles.container}>
                    <div style={styles.resultHeader}>
                        <h1 style={styles.resultTitle}>Kết quả Mini Test</h1>
                    </div>

                    <div style={styles.resultBox}>
                        <div style={styles.scoreCircle}>
                            <span style={{ ...styles.scoreNumber, color: getScoreColor(result.score) }}>
                                {result.score}%
                            </span>
                        </div>
                        <p style={styles.resultSummary}>
                            Đúng <strong>{result.correctCount}</strong> / {result.totalQuestions} câu
                        </p>
                        {result.pointsEarned > 0 && (
                            <p style={styles.pointsEarned}>+{result.pointsEarned} điểm</p>
                        )}
                    </div>

                    <div style={styles.resultDetails}>
                        {result.results && result.results.map((r, index) => (
                            <div 
                                key={index} 
                                style={{ 
                                    ...styles.resultItem, 
                                    ...(r.isCorrect ? styles.correctItem : styles.wrongItem) 
                                }}
                            >
                                <div style={styles.resultItemHeader}>
                                    <strong>Câu {index + 1}</strong>
                                    <span style={{
                                        ...styles.resultStatus,
                                        backgroundColor: r.isCorrect ? '#28A745' : '#DC3545'
                                    }}>
                                        {r.isCorrect ? 'Đúng' : 'Sai'}
                                    </span>
                                </div>
                                <p style={styles.resultAnswer}>
                                    <span style={styles.answerLabel}>Đáp án của bạn:</span>{' '}
                                    {r.userAnswer || '(bỏ trống)'}
                                </p>
                                <p style={styles.resultAnswer}>
                                    <span style={styles.answerLabel}>Đáp án đúng:</span>{' '}
                                    <strong style={{ color: '#28A745' }}>{r.correctAnswer}</strong>
                                </p>
                                {r.explanation && (
                                    <p style={styles.explanation}>{r.explanation}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div style={styles.buttonGroup}>
                        <button 
                            onClick={() => { setSubmitted(false); setQuestions([]); setAnswers({}); }} 
                            style={styles.primaryButton}
                        >
                            Làm bài mới
                        </button>
                        <button 
                            onClick={() => navigate('/dashboard')} 
                            style={styles.secondaryButton}
                        >
                            Về Dashboard
                        </button>
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
                    <h1 style={styles.title}>Mini Test</h1>
                    <p style={styles.subtitle}>Tạo bài test ngẫu nhiên từ nhiều Unit</p>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                {questions.length === 0 ? (
                    <>
                        <div style={styles.optionsCard}>
                            <div style={styles.optionsGrid}>
                                <div style={styles.optionGroup}>
                                    <label style={styles.label}>Trình độ</label>
                                    <select
                                        value={options.level}
                                        onChange={(e) => setOptions({ ...options, level: e.target.value })}
                                        style={styles.select}
                                    >
                                        <option value="A1">A1</option>
                                        <option value="A2">A2</option>
                                        <option value="B1">B1</option>
                                        <option value="B2">B2</option>
                                        <option value="C1">C1</option>
                                    </select>
                                </div>

                                <div style={styles.optionGroup}>
                                    <label style={styles.label}>Số câu hỏi</label>
                                    <input
                                        type="number"
                                        value={options.count}
                                        onChange={(e) => setOptions({ ...options, count: parseInt(e.target.value) || 5 })}
                                        min="1"
                                        max="50"
                                        style={styles.input}
                                    />
                                </div>
                            </div>

                            <div style={styles.optionGroup}>
                                <label style={styles.label}>Loại câu hỏi (giữ Ctrl để chọn nhiều)</label>
                                <select
                                    value={options.questionTypes}
                                    onChange={(e) => {
                                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                                        setOptions({ ...options, questionTypes: selected });
                                    }}
                                    style={styles.multiSelect}
                                    multiple
                                >
                                    {questionTypeOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button onClick={handleGenerate} style={styles.generateButton}>
                            Tạo bài test
                        </button>
                    </>
                ) : (
                    <div style={styles.questionList}>
                        <h2 style={styles.sectionTitle}>
                            Bài test ({questions.length} câu)
                        </h2>
                        {questions.map((q, index) => (
                            <div key={q.id} style={styles.questionCard}>
                                <div style={styles.questionHeader}>
                                    <span style={styles.questionNumber}>Câu {index + 1}</span>
                                    <span style={styles.questionType}>
                                        {q.question_type.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                                <p style={styles.questionContent}>{q.content}</p>
                                
                                {q.question_type === 'multiple_choice' && q.options && (
                                    <div style={styles.optionsList}>
                                        {q.options.map((opt, i) => (
                                            <label key={i} style={styles.optionLabel}>
                                                <input
                                                    type="radio"
                                                    name={`q-${q.id}`}
                                                    value={opt}
                                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                    style={styles.radioInput}
                                                />
                                                <span>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                                {(q.question_type === 'gap_filling' || q.question_type === 'word_formation') && (
                                    <input
                                        type="text"
                                        placeholder="Nhập đáp án..."
                                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                        style={styles.answerInput}
                                    />
                                )}
                                {q.question_type === 'sentence_transformation' && (
                                    <textarea
                                        placeholder="Viết lại câu..."
                                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                        style={styles.answerTextarea}
                                    />
                                )}
                                {q.question_type === 'error_correction' && (
                                    <input
                                        type="text"
                                        placeholder="Sửa lỗi..."
                                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                        style={styles.answerInput}
                                    />
                                )}
                            </div>
                        ))}
                        <button onClick={handleSubmit} style={styles.submitButton}>
                            Nộp bài
                        </button>
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
        background: 'radial-gradient(circle, rgba(13, 110, 253, 0.12) 0%, rgba(13, 110, 253, 0) 70%)',
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
    optionsCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '32px',
        borderRadius: '16px',
        border: '2px solid #DCE8F5',
        boxShadow: '0 4px 24px rgba(13, 110, 253, 0.08)',
        marginBottom: '24px'
    },
    optionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
    },
    optionGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#495057'
    },
    select: {
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #CED4DA',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: '#F8F9FA',
        cursor: 'pointer'
    },
    multiSelect: {
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #CED4DA',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: '#F8F9FA',
        cursor: 'pointer',
        minHeight: '120px'
    },
    input: {
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #CED4DA',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: '#F8F9FA'
    },
    generateButton: {
        padding: '16px',
        backgroundColor: '#0D6EFD',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        width: '100%',
        boxShadow: '0 6px 20px rgba(13, 110, 253, 0.35)',
        transition: 'all 0.25s ease'
    },
    questionList: {
        marginTop: '24px'
    },
    sectionTitle: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#212529',
        marginBottom: '20px'
    },
    questionCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '24px',
        borderRadius: '12px',
        border: '2px solid #DCE8F5',
        boxShadow: '0 2px 12px rgba(13, 110, 253, 0.06)',
        marginBottom: '16px'
    },
    questionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
    },
    questionNumber: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#0D6EFD',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    questionType: {
        padding: '4px 10px',
        backgroundColor: '#E7F1FF',
        color: '#0D6EFD',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600',
        letterSpacing: '0.5px'
    },
    questionContent: {
        fontSize: '16px',
        color: '#212529',
        lineHeight: '1.6',
        marginBottom: '16px'
    },
    optionsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    optionLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 14px',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        fontSize: '15px',
        color: '#495057'
    },
    radioInput: {
        cursor: 'pointer',
        width: '18px',
        height: '18px',
        accentColor: '#0D6EFD'
    },
    answerInput: {
        padding: '12px 16px',
        border: '1px solid #CED4DA',
        borderRadius: '8px',
        width: '100%',
        fontSize: '15px',
        outline: 'none',
        backgroundColor: '#F8F9FA',
        boxSizing: 'border-box'
    },
    answerTextarea: {
        padding: '12px 16px',
        border: '1px solid #CED4DA',
        borderRadius: '8px',
        width: '100%',
        fontSize: '15px',
        outline: 'none',
        backgroundColor: '#F8F9FA',
        minHeight: '80px',
        fontFamily: 'inherit',
        boxSizing: 'border-box'
    },
    submitButton: {
        padding: '16px',
        backgroundColor: '#28A745',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        width: '100%',
        marginTop: '16px',
        boxShadow: '0 6px 20px rgba(40, 167, 69, 0.35)'
    },
    resultHeader: {
        textAlign: 'center',
        marginBottom: '32px'
    },
    resultTitle: {
        fontSize: '32px',
        fontWeight: '800',
        color: '#212529',
        margin: 0
    },
    resultBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '40px',
        borderRadius: '16px',
        border: '2px solid #DCE8F5',
        textAlign: 'center',
        marginBottom: '24px',
        boxShadow: '0 4px 24px rgba(13, 110, 253, 0.08)'
    },
    scoreCircle: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '140px',
        height: '140px',
        borderRadius: '50%',
        border: '6px solid #F6F9FE',
        boxShadow: '0 4px 20px rgba(13, 110, 253, 0.15)',
        marginBottom: '20px'
    },
    scoreNumber: {
        fontSize: '40px',
        fontWeight: '800'
    },
    resultSummary: {
        fontSize: '18px',
        color: '#495057',
        margin: '0 0 8px 0'
    },
    pointsEarned: {
        fontSize: '16px',
        color: '#0D6EFD',
        fontWeight: '700',
        margin: 0
    },
    resultDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '24px'
    },
    resultItem: {
        padding: '20px',
        borderRadius: '12px',
        border: '2px solid transparent'
    },
    correctItem: {
        backgroundColor: '#D4EDDA',
        borderColor: '#28A745'
    },
    wrongItem: {
        backgroundColor: '#F8D7DA',
        borderColor: '#DC3545'
    },
    resultItemHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
    },
    resultStatus: {
        padding: '4px 12px',
        color: '#FFFFFF',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600'
    },
    resultAnswer: {
        fontSize: '14px',
        color: '#495057',
        margin: '4px 0'
    },
    answerLabel: {
        fontWeight: '600',
        color: '#212529'
    },
    explanation: {
        fontSize: '13px',
        color: '#6C757D',
        fontStyle: 'italic',
        marginTop: '8px',
        paddingTop: '8px',
        borderTop: '1px solid rgba(0,0,0,0.08)'
    },
    buttonGroup: {
        display: 'flex',
        gap: '12px'
    },
    primaryButton: {
        flex: 1,
        padding: '14px',
        backgroundColor: '#0D6EFD',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(13, 110, 253, 0.35)'
    },
    secondaryButton: {
        flex: 1,
        padding: '14px',
        backgroundColor: '#6C757D',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(108, 117, 125, 0.25)'
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
    },
    error: {
        backgroundColor: '#F8D7DA',
        color: '#721C24',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '14px'
    }
};

// Inject keyframes
if (typeof document !== 'undefined') {
    const existing = document.getElementById('minitest-keyframes');
    if (!existing) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'minitest-keyframes';
        styleSheet.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

export default MiniTest;