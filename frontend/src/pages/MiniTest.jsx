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
            // Lấy unitId từ câu hỏi đầu tiên
            const unitId = questions[0]?.unit_id;
            const data = await submitQuiz(unitId, answerList);
            setResult(data);
            setSubmitted(true);
        } catch (err) {
            setError('Lỗi nộp bài');
        }
    };

    if (loading) return <div style={styles.container}>Đang tạo bài test...</div>;

    if (submitted && result) {
        return (
            <div style={styles.container}>
                <h1 style={styles.title}>📊 Kết quả Mini Test</h1>
                <div style={styles.resultBox}>
                    <p style={styles.score}>Điểm: {result.score}%</p>
                    <p>Đúng: {result.correctCount} / {result.totalQuestions}</p>
                </div>
                <div style={styles.resultDetails}>
                    {result.results && result.results.map((r, index) => (
                        <div key={index} style={{ ...styles.resultItem, ...(r.isCorrect ? styles.correct : styles.wrong) }}>
                            <p><strong>Câu {index + 1}:</strong> {r.isCorrect ? '✅ Đúng' : '❌ Sai'}</p>
                            <p>Đáp án của bạn: {r.userAnswer || '(bỏ trống)'}</p>
                            <p>Đáp án đúng: {r.correctAnswer}</p>
                            {r.explanation && <p style={styles.explanation}>💡 {r.explanation}</p>}
                        </div>
                    ))}
                </div>
                <div style={styles.buttonGroup}>
                    <button onClick={() => { setSubmitted(false); setQuestions([]); setAnswers({}); }} style={styles.button}>
                        Làm bài mới
                    </button>
                    <button onClick={() => navigate('/dashboard')} style={{ ...styles.button, ...styles.buttonSecondary }}>
                        Về Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>🎯 Mini Test</h1>
            <p style={styles.subtitle}>Tạo bài test ngẫu nhiên từ nhiều Unit</p>

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.options}>
                <div style={styles.optionGroup}>
                    <label>Trình độ:</label>
                    <select
                        value={options.level}
                        onChange={(e) => setOptions({ ...options, level: e.target.value })}
                        style={styles.select}
                    >
                        <option value="B2">B2</option>
                        <option value="C1">C1</option>
                    </select>
                </div>

                <div style={styles.optionGroup}>
                    <label>Số câu hỏi:</label>
                    <input
                        type="number"
                        value={options.count}
                        onChange={(e) => setOptions({ ...options, count: parseInt(e.target.value) || 5 })}
                        min="1"
                        max="50"
                        style={styles.input}
                    />
                </div>

                <div style={styles.optionGroup}>
                    <label>Loại câu hỏi:</label>
                    <select
                        value={options.questionTypes}
                        onChange={(e) => {
                            const selected = Array.from(e.target.selectedOptions, option => option.value);
                            setOptions({ ...options, questionTypes: selected });
                        }}
                        style={styles.select}
                        multiple
                    >
                        {questionTypeOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <small style={styles.hint}>(Giữ Ctrl để chọn nhiều)</small>
                </div>
            </div>

            <button onClick={handleGenerate} style={styles.generateButton} disabled={loading}>
                🚀 Tạo bài test
            </button>

            {questions.length > 0 && !submitted && (
                <div style={styles.questionList}>
                    <h2 style={styles.sectionTitle}>📝 Bài test ({questions.length} câu)</h2>
                    {questions.map((q, index) => (
                        <div key={q.id} style={styles.questionCard}>
                            <p style={styles.questionText}>
                                <strong>Câu {index + 1}:</strong> {q.content}
                                <span style={styles.questionType}>{q.question_type.replace('_', ' ').toUpperCase()}</span>
                            </p>
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
                            {(q.question_type === 'gap_filling' || q.question_type === 'word_formation') && (
                                <input
                                    type="text"
                                    placeholder="Nhập đáp án..."
                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                    style={styles.inputField}
                                />
                            )}
                            {q.question_type === 'sentence_transformation' && (
                                <textarea
                                    placeholder="Viết lại câu..."
                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                    style={styles.textarea}
                                />
                            )}
                            {q.question_type === 'error_correction' && (
                                <input
                                    type="text"
                                    placeholder="Sửa lỗi..."
                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                    style={styles.inputField}
                                />
                            )}
                        </div>
                    ))}
                    <button onClick={handleSubmit} style={styles.submitButton}>
                        📤 Nộp bài
                    </button>
                </div>
            )}
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
    title: {
        textAlign: 'center',
        color: '#333'
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        marginBottom: '30px'
    },
    options: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px'
    },
    optionGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    select: {
        padding: '8px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '14px'
    },
    input: {
        padding: '8px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '14px'
    },
    inputField: {
        padding: '8px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '14px',
        width: '100%',
        marginTop: '8px'
    },
    textarea: {
        padding: '8px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        minHeight: '60px',
        width: '100%',
        marginTop: '8px',
        fontSize: '14px'
    },
    hint: {
        fontSize: '12px',
        color: '#666'
    },
    generateButton: {
        padding: '12px 30px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        width: '100%'
    },
    questionList: {
        marginTop: '30px'
    },
    sectionTitle: {
        marginBottom: '20px'
    },
    questionCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '15px'
    },
    questionText: {
        marginBottom: '10px'
    },
    questionType: {
        display: 'inline-block',
        padding: '2px 8px',
        backgroundColor: '#e9ecef',
        borderRadius: '3px',
        fontSize: '11px',
        marginLeft: '10px'
    },
    option: {
        display: 'block',
        margin: '8px 0',
        cursor: 'pointer'
    },
    submitButton: {
        padding: '12px 30px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
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
        fontStyle: 'italic',
        marginTop: '5px'
    },
    error: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px'
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px'
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        flex: 1
    },
    buttonSecondary: {
        backgroundColor: '#6c757d'
    }
};

export default MiniTest;