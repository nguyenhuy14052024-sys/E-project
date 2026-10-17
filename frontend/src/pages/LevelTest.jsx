import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTestForUser, submitTest } from '../services/levelTestService';

const LevelTest = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);
    const [timeSpent, setTimeSpent] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        fetchTest();
    }, [testId]);

    useEffect(() => {
        if (test && !submitted) {
            const duration = test.duration * 60;
            setTimeLeft(duration);

            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleAutoSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
                setTimeSpent(prev => prev + 1);
            }, 1000);

            return () => clearInterval(timerRef.current);
        }
    }, [test, submitted]);

    const fetchTest = async () => {
        setLoading(true);
        try {
            const data = await getTestForUser(testId);
            setTest(data.test);
        } catch (err) {
            setError('Không thể tải bài test');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId, value) => {
        if (submitted) return;
        setAnswers({ ...answers, [questionId]: value });
    };

    const handleAutoSubmit = () => {
        if (!submitted) {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (submitted) return;

        clearInterval(timerRef.current);

        const answerList = Object.entries(answers).map(([questionId, userAnswer]) => ({
            questionId,
            userAnswer
        }));

        // Cảnh báo nếu nộp trống (không chặn)
        if (answerList.length === 0) {
            const confirmed = window.confirm(
                'Bạn chưa chọn đáp án nào. Vẫn nộp bài? (Bài sẽ được tính 0 điểm)'
            );
            if (!confirmed) return;
        }

        console.log('📤 testId:', testId);
        console.log('📤 answerList:', answerList);
        console.log('📤 timeSpent:', timeSpent);

        try {
            const data = await submitTest(testId, answerList, timeSpent);
            setResult(data);
            setSubmitted(true);
            window.scrollTo(0, 0);
        } catch (err) {
            console.error('❌ Submit error:', err);
            setError('Lỗi nộp bài');
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const getGroupLabel = (group) => {
        const labels = {
            pronunciation: 'PHONETICS',
            word_stress: 'PHONETICS',
            sentence_completion: 'MULTIPLE CHOICE',
            synonym_antonym: 'MULTIPLE CHOICE',
            communication: 'COMMUNICATION',
            cloze_test: 'READING',
            reading_comprehension: 'READING',
            true_false: 'READING',
            error_identification: 'WRITING',
            sentence_transformation: 'WRITING',
            sentence_combination: 'WRITING'
        };
        return labels[group] || 'QUESTIONS';
    };

    if (loading) {
        return (
            <div style={styles.page}>
                <div style={styles.container}>
                    <div style={styles.loadingWrapper}>
                        <div style={styles.spinner}></div>
                        <p style={styles.loadingText}>Loading test...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) return (
        <div style={styles.page}>
            <div style={styles.container}>
                <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
            </div>
        </div>
    );

    if (!test) return null;

    // Nhóm câu hỏi theo group
    const groupedQuestions = {};
    test.questions.forEach(q => {
        const label = getGroupLabel(q.question_group);
        if (!groupedQuestions[label]) groupedQuestions[label] = [];
        groupedQuestions[label].push(q);
    });

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <div style={styles.headerContent}>
                    <div>
                        <h1 style={styles.testTitle}>
                            ENGLISH TEST - LEVEL {test.book_level}
                        </h1>
                        <p style={styles.testInfo}>
                            {test.title} | Total score: {test.total_score} points
                        </p>
                    </div>
                    <div style={styles.timer}>
                        <span style={styles.timerLabel}>Time left</span>
                        <span style={{
                            ...styles.timerValue,
                            color: timeLeft < 60 ? '#DC3545' : '#0D6EFD'
                        }}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>
            </div>

            <div style={styles.container}>
                {submitted && result && (
                    <div style={styles.resultBanner}>
                        <h2 style={styles.resultTitle}>TEST RESULT</h2>
                        <p style={styles.resultScore}>
                            Score: <strong>{result.score}%</strong>
                        </p>
                        <p style={styles.resultDetail}>
                            Correct: {result.correctCount} / {result.totalQuestions}
                        </p>
                        <p style={styles.resultDetail}>
                            Points: {result.totalScore} / {result.maxScore}
                        </p>
                        <div style={styles.resultButtons}>
                            <button onClick={() => navigate('/dashboard')} style={styles.btnPrimary}>
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                )}

                {Object.entries(groupedQuestions).map(([groupLabel, questions]) => (
                    <div key={groupLabel} style={styles.section}>
                        <h2 style={styles.sectionTitle}>{groupLabel}</h2>

                        {questions.map((q, idx) => {
                            const answerResult = submitted && result
                                ? result.results?.find(r => r.questionId === q.id)
                                : null;

                            return (
                                <div key={q.id} style={styles.questionBlock}>
                                    <div style={styles.questionText}>
                                        <strong>{idx + 1}.</strong>
                                        <span dangerouslySetInnerHTML={{ __html: ' ' + q.content }} />
                                    </div>

                                    {q.options && (
                                        <div style={styles.optionsList}>
                                            {q.options.map((opt, i) => {
                                                const isSelected = answers[q.id] === opt;
                                                const isCorrect = submitted && answerResult && answerResult.correctAnswer === opt;
                                                const isWrong = submitted && isSelected && !isCorrect;

                                                return (
                                                    <label
                                                        key={i}
                                                        style={{
                                                            ...styles.optionItem,
                                                            ...(isCorrect ? styles.optionCorrect : {}),
                                                            ...(isWrong ? styles.optionWrong : {}),
                                                            ...(submitted ? styles.optionDisabled : {})
                                                        }}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`q-${q.id}`}
                                                            value={opt}
                                                            checked={isSelected || false}
                                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                            disabled={submitted}
                                                            style={styles.radioInput}
                                                        />
                                                        <span style={styles.optionLabel}>
                                                            {String.fromCharCode(65 + i)}. {opt}
                                                        </span>
                                                        {isCorrect && <span style={styles.checkMark}>✓</span>}
                                                        {isWrong && <span style={styles.crossMark}>✗</span>}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {submitted && answerResult && (
                                        <div style={styles.explanation}>
                                            <p style={styles.explanationTitle}>Answer: {answerResult.correctAnswer}</p>
                                            {answerResult.explanation && (
                                                <p style={styles.explanationText}>{answerResult.explanation}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}

                <div style={styles.theEnd}>
                    --- The End ---
                </div>

                {!submitted && (
                    <button onClick={handleSubmit} style={styles.submitButton}>
                        SUBMIT TEST
                    </button>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        fontFamily: "'Times New Roman', 'Georgia', serif",
        width: '100%',
        maxWidth: '100vw',
        boxSizing: 'border-box'
    },
    header: {
        backgroundColor: '#FFFFFF',
        borderBottom: '2px solid #000',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '16px 0'
    },
    headerContent: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
    },
    testTitle: {
        fontSize: 'clamp(18px, 4vw, 22px)',
        fontWeight: '700',
        color: '#000',
        margin: '0 0 4px 0',
        letterSpacing: '0.5px'
    },
    testInfo: {
        fontSize: '13px',
        color: '#333',
        margin: 0
    },
    timer: {
        textAlign: 'right'
    },
    timerLabel: {
        display: 'block',
        fontSize: '11px',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    timerValue: {
        fontSize: 'clamp(20px, 5vw, 26px)',
        fontWeight: '700',
        fontFamily: 'monospace'
    },
    container: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '32px 24px',
        boxSizing: 'border-box'
    },
    section: {
        marginBottom: '40px'
    },
    sectionTitle: {
        fontSize: 'clamp(16px, 4vw, 18px)',
        fontWeight: '700',
        color: '#000',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        borderBottom: '1px solid #000',
        paddingBottom: '8px',
        marginBottom: '20px'
    },
    questionBlock: {
        marginBottom: '20px',
        paddingLeft: '8px'
    },
    questionText: {
        fontSize: '15px',
        color: '#000',
        lineHeight: '1.7',
        margin: '0 0 10px 0'
    },
    optionsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        paddingLeft: '20px'
    },
    optionItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '6px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#000',
        transition: 'background-color 0.2s'
    },
    optionCorrect: {
        backgroundColor: '#D4EDDA',
        borderLeft: '4px solid #28A745'
    },
    optionWrong: {
        backgroundColor: '#F8D7DA',
        borderLeft: '4px solid #DC3545'
    },
    optionDisabled: {
        cursor: 'default'
    },
    radioInput: {
        cursor: 'pointer',
        width: '16px',
        height: '16px'
    },
    optionLabel: {
        flex: 1
    },
    checkMark: {
        color: '#28A745',
        fontWeight: '700',
        fontSize: '16px'
    },
    crossMark: {
        color: '#DC3545',
        fontWeight: '700',
        fontSize: '16px'
    },
    explanation: {
        marginTop: '10px',
        padding: '10px 14px',
        backgroundColor: '#F8F9FA',
        borderLeft: '3px solid #0D6EFD',
        fontSize: '13px'
    },
    explanationTitle: {
        margin: '0 0 4px 0',
        fontWeight: '700',
        color: '#0D6EFD'
    },
    explanationText: {
        margin: 0,
        color: '#495057',
        lineHeight: '1.6'
    },
    theEnd: {
        textAlign: 'center',
        fontSize: '16px',
        fontWeight: '700',
        color: '#000',
        letterSpacing: '2px',
        margin: '40px 0',
        paddingTop: '20px',
        borderTop: '1px solid #CCC'
    },
    submitButton: {
        display: 'block',
        margin: '0 auto',
        padding: '14px 48px',
        backgroundColor: '#0D6EFD',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        letterSpacing: '1px',
        maxWidth: '100%',
        boxSizing: 'border-box'
    },
    resultBanner: {
        backgroundColor: '#F0F8FF',
        border: '2px solid #0D6EFD',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px',
        textAlign: 'center'
    },
    resultTitle: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#0D6EFD',
        margin: '0 0 12px 0',
        letterSpacing: '2px'
    },
    resultScore: {
        fontSize: '28px',
        margin: '8px 0',
        color: '#000'
    },
    resultDetail: {
        fontSize: '15px',
        color: '#495057',
        margin: '4px 0'
    },
    resultButtons: {
        marginTop: '16px'
    },
    btnPrimary: {
        padding: '10px 24px',
        backgroundColor: '#0D6EFD',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    loadingWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
        margin: 0
    }
};

if (typeof document !== 'undefined') {
    const existing = document.getElementById('leveltest-keyframes');
    if (!existing) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'leveltest-keyframes';
        styleSheet.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

export default LevelTest;