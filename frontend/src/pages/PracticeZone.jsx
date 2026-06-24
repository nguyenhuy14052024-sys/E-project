import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getQuestions, submitQuiz } from '../services/unitService';

const PracticeZone = () => {
    const { unitId } = useParams();
    const [searchParams] = useSearchParams();
    const filterType = searchParams.get('type') || '';
    const navigate = useNavigate();
    
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [unitTitle, setUnitTitle] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchQuestions();
    }, [unitId, filterType]);

    const fetchQuestions = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getQuestions(unitId, filterType);
            if (data && data.questions) {
                setQuestions(data.questions || []);
                setUnitTitle(data.unit?.title || '');
            } else {
                setQuestions([]);
            }
        } catch (error) {
            console.error('Lỗi lấy câu hỏi:', error);
            setError('Không thể tải câu hỏi. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const handleSubmit = async () => {
        const answerList = Object.entries(answers).map(([questionId, userAnswer]) => ({
            questionId,
            userAnswer
        }));

        try {
            const data = await submitQuiz(unitId, answerList);
            setResult(data);
            setSubmitted(true);
        } catch (error) {
            console.error('Lỗi nộp bài:', error);
            alert('Lỗi nộp bài. Vui lòng thử lại.');
        }
    };

    if (loading) {
        return <div style={styles.container}>Đang tải câu hỏi...</div>;
    }

    if (error) {
        return <div style={styles.container} style={{ color: 'red' }}>{error}</div>;
    }

    if (submitted && result) {
        return (
            <div style={styles.container}>
                <h1>Ket qua: {unitTitle}</h1>
                <div style={styles.resultBox}>
                    <p style={styles.score}>Diem: {result.score}%</p>
                    <p>Dung: {result.correctCount} / {result.totalQuestions}</p>
                </div>
                <div style={styles.resultDetails}>
                    {result.results && result.results.map((r, index) => (
                        <div key={index} style={{ ...styles.resultItem, ...(r.isCorrect ? styles.correct : styles.wrong) }}>
                            <p><strong>Cau {index + 1}:</strong> {r.isCorrect ? 'Dung' : 'Sai'}</p>
                            <p>Dap an cua ban: {r.userAnswer || 'Chua chon'}</p>
                            <p>Dap an dung: {r.correctAnswer}</p>
                            {r.explanation && <p style={styles.explanation}>Giai thich: {r.explanation}</p>}
                        </div>
                    ))}
                </div>
                <button onClick={() => navigate(`/learn/${unitId}?type=${filterType}`)} style={styles.button}>
                    Quay lai hoc
                </button>
            </div>
        );
    }

    if (questions.length === 0) {
        return <div style={styles.container}>Chua co cau hoi cho Unit nay</div>;
    }

    return (
        <div style={styles.container}>
            <h1>Bai tap: {unitTitle}</h1>
            {filterType && (
                <p style={styles.filterInfo}>Dang loc: <strong>{filterType.replace('_', ' ').toUpperCase()}</strong></p>
            )}
            {questions.map((q, index) => (
                <div key={q.id} style={styles.questionCard}>
                    <p><strong>Cau {index + 1}:</strong> {q.content}</p>
                    {q.question_type === 'multiple_choice' && q.options && q.options.length > 0 && (
                        <div>
                            {q.options.map((opt, i) => (
                                <label key={i} style={styles.option}>
                                    <input
                                        type="radio"
                                        name={`q-${q.id}`}
                                        value={opt}
                                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    )}
                    {(q.question_type === 'gap_filling' || q.question_type === 'word_formation') && (
                        <input
                            type="text"
                            placeholder="Nhap dap an..."
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            style={styles.input}
                        />
                    )}
                    {q.question_type === 'sentence_transformation' && (
                        <textarea
                            placeholder="Viet lai cau..."
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            style={styles.textarea}
                        />
                    )}
                    {q.question_type === 'error_correction' && (
                        <input
                            type="text"
                            placeholder="Sua loi..."
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            style={styles.input}
                        />
                    )}
                </div>
            ))}
            <button onClick={handleSubmit} style={styles.submitButton}>
                Nop bai
            </button>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px',
        maxWidth: '900px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif'
    },
    filterInfo: {
        backgroundColor: '#e3f2fd',
        padding: '10px 15px',
        borderRadius: '5px',
        marginBottom: '20px'
    },
    questionCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
    },
    option: {
        display: 'block',
        margin: '8px 0',
        cursor: 'pointer'
    },
    input: {
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        width: '100%',
        marginTop: '10px',
        fontSize: '16px'
    },
    textarea: {
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        width: '100%',
        marginTop: '10px',
        fontSize: '16px',
        minHeight: '80px'
    },
    submitButton: {
        padding: '15px 40px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '18px',
        cursor: 'pointer',
        width: '100%',
        marginTop: '10px'
    },
    resultBox: {
        backgroundColor: '#e9ecef',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
        marginBottom: '20px'
    },
    score: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#28a745'
    },
    resultDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '20px'
    },
    resultItem: {
        padding: '15px',
        borderRadius: '5px'
    },
    correct: {
        backgroundColor: '#d4edda'
    },
    wrong: {
        backgroundColor: '#f8d7da'
    },
    explanation: {
        color: '#666',
        fontStyle: 'italic',
        marginTop: '5px'
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    }
};

export default PracticeZone;