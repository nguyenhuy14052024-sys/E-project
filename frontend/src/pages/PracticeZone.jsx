import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestions, submitQuiz } from '../services/unitService';

const PracticeZone = () => {
    const { unitId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [unitTitle, setUnitTitle] = useState('');

    useEffect(() => {
        fetchQuestions();
    }, [unitId]);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const data = await getQuestions(unitId);
            setQuestions(data.questions || []);
            setUnitTitle(data.unit?.title || '');
        } catch (error) {
            console.error('Lỗi lấy câu hỏi:', error);
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
        }
    };

    if (loading) return <div style={styles.container}>Đang tải câu hỏi...</div>;

    if (submitted && result) {
        return (
            <div style={styles.container}>
                <h1>📊 Kết quả: {unitTitle}</h1>
                <div style={styles.resultBox}>
                    <p style={styles.score}>Điểm: {result.score}%</p>
                    <p>Đúng: {result.correctCount} / {result.totalQuestions}</p>
                </div>
                <div style={styles.resultDetails}>
                    {result.results.map((r, index) => (
                        <div key={index} style={{ ...styles.resultItem, ...(r.isCorrect ? styles.correct : styles.wrong) }}>
                            <p><strong>Câu {index + 1}:</strong> {r.isCorrect ? '✅ Đúng' : '❌ Sai'}</p>
                            <p>Đáp án của bạn: {r.userAnswer}</p>
                            <p>Đáp án đúng: {r.correctAnswer}</p>
                            {r.explanation && <p style={styles.explanation}>💡 {r.explanation}</p>}
                        </div>
                    ))}
                </div>
                <button onClick={() => navigate(`/learn/${unitId}`)} style={styles.button}>
                    Quay lại học
                </button>
            </div>
        );
    }

    if (questions.length === 0) {
        return <div style={styles.container}>Chưa có câu hỏi cho Unit này</div>;
    }

    return (
        <div style={styles.container}>
            <h1>✍️ Bài tập: {unitTitle}</h1>
            {questions.map((q, index) => (
                <div key={q.id} style={styles.questionCard}>
                    <p><strong>Câu {index + 1}:</strong> {q.content}</p>
                    {q.question_type === 'multiple_choice' && q.options && (
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
                    {q.question_type === 'gap_filling' && (
                        <input
                            type="text"
                            placeholder="Điền đáp án..."
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            style={styles.input}
                        />
                    )}
                    {q.question_type === 'word_formation' && (
                        <input
                            type="text"
                            placeholder="Biến đổi từ..."
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            style={styles.input}
                        />
                    )}
                </div>
            ))}
            <button onClick={handleSubmit} style={styles.submitButton}>
                📤 Nộp bài
            </button>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px',
        maxWidth: '900px',
        margin: '0 auto'
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
        margin: '8px 0'
    },
    input: {
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        width: '100%',
        marginTop: '10px',
        fontSize: '16px'
    },
    submitButton: {
        padding: '15px 40px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '18px',
        cursor: 'pointer',
        width: '100%'
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
        fontStyle: 'italic'
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