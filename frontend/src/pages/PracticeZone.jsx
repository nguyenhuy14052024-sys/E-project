import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getUnitById } from '../services/unitService'; // Cần import thêm để lấy exercise_parts
import { getQuestions, submitQuiz } from '../services/unitService';
import DictionaryPopup from '../components/DictionaryPopup';
import CertificateNotification from '../components/CertificateNotification';

const PracticeZone = () => {
    const { unitId } = useParams();
    const [searchParams] = useSearchParams();
    const filterType = searchParams.get('type') || '';
    const navigate = useNavigate();
    
    // State cho bài tập văn bản (mới)
    const [unitData, setUnitData] = useState(null);
    const [isTextMode, setIsTextMode] = useState(false);
    
    // State cho bài tập trắc nghiệm (cũ)
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [unitTitle, setUnitTitle] = useState('');
    const [error, setError] = useState('');
    const [selectedWord, setSelectedWord] = useState(null);
    const [newCertificate, setNewCertificate] = useState(null);

    useEffect(() => {
        fetchData();
    }, [unitId, filterType]);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            // 1. Lấy thông tin Unit để check exercise_parts
            const unitRes = await getUnitById(unitId);
            const unit = unitRes.unit;
            setUnitData(unit);
            setUnitTitle(unit.title);

            // 2. Nếu có bài tập văn bản, chuyển sang chế độ Text
            if (unit.exercise_parts && Array.isArray(unit.exercise_parts) && unit.exercise_parts.length > 0) {
                setIsTextMode(true);
            } else {
                // 3. Nếu không, load câu hỏi trắc nghiệm như cũ
                const data = await getQuestions(unitId, filterType);
                if (data && data.questions) {
                    setQuestions(data.questions || []);
                }
            }
        } catch (error) {
            console.error('Lỗi tải dữ liệu:', error);
            setError('Không thể tải bài tập. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // --- CÁC HÀM XỬ LÝ BÀI TẬP TRẮC NGHIỆM (GIỮ NGUYÊN) ---
    const handleAnswerChange = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const handleWordClick = (e) => {
        if (e.target.tagName === 'SPAN' && e.target.dataset.word) {
            setSelectedWord(e.target.dataset.word);
        }
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

            if (data.newCertificate) {
                setNewCertificate(data.newCertificate);
            }
        } catch (error) {
            console.error('Lỗi nộp bài:', error);
            alert('Lỗi nộp bài. Vui lòng thử lại.');
        }
    };

    if (loading) {
        return <div style={styles.container}>Đang tải bài tập...</div>;
    }

    if (error) {
        return <div style={{ ...styles.container, color: 'red' }}>{error}</div>;
    }

    // --- GIAO DIỆN BÀI TẬP VĂN BẢN (MỚI) ---
    if (isTextMode) {
        return (
            <div style={styles.textModeContainer}>
                <div style={styles.header}>
                    <button onClick={() => navigate(`/learn/${unitId}`)} style={styles.backButton}>
                        ← Quay lại bài học
                    </button>
                    <h1 style={styles.title}>Bài tập: {unitTitle}</h1>
                </div>

                <div style={styles.exerciseWrapper}>
                    {unitData.exercise_parts.map((part, index) => (
                        <div key={index} style={styles.partBox}>
                            {part.title && (
                                <h3 style={styles.partTitle}>{part.title}</h3>
                            )}
                            <div 
                                style={styles.partContent}
                                dangerouslySetInnerHTML={{ __html: part.content }} 
                            />
                        </div>
                    ))}
                </div>

                <div style={styles.footer}>
                    <button onClick={() => navigate(`/learn/${unitId}`)} style={styles.submitButton}>
                        Đã làm xong (Quay lại bài học)
                    </button>
                </div>
            </div>
        );
    }

    // --- GIAO DIỆN BÀI TẬP TRẮC NGHIỆM CŨ (GIỮ NGUYÊN) ---
    if (submitted && result) {
        return (
            <div style={styles.container}>
                <h1 style={styles.title}>Kết quả: {unitTitle}</h1>
                <div style={styles.resultBox}>
                    <p style={styles.score}>Điểm: {result.score}%</p>
                    <p>Đúng: {result.correctCount} / {result.totalQuestions}</p>
                    {result.pointsEarned && (
                        <p style={styles.pointsEarned}>+{result.pointsEarned} điểm</p>
                    )}
                </div>
                <div style={styles.resultDetails}>
                    {result.results && result.results.map((r, index) => (
                        <div key={index} style={{ ...styles.resultItem, ...(r.isCorrect ? styles.correct : styles.wrong) }}>
                            <p><strong>Câu {index + 1}:</strong> {r.isCorrect ? 'Đúng' : 'Sai'}</p>
                            <p>Đáp án của bạn: {r.userAnswer || 'Chưa chọn'}</p>
                            <p>Đáp án đúng: {r.correctAnswer}</p>
                            {r.explanation && <p style={styles.explanation}>Giải thích: {r.explanation}</p>}
                        </div>
                    ))}
                </div>
                <button onClick={() => navigate(`/learn/${unitId}?type=${filterType}`)} style={styles.button}>
                    Quay lại học
                </button>

                {newCertificate && (
                    <CertificateNotification
                        certificate={newCertificate}
                        onClose={() => setNewCertificate(null)}
                        onViewProfile={() => navigate('/profile')}
                    />
                )}
            </div>
        );
    }

    if (questions.length === 0) {
        return <div style={styles.container}>Chưa có câu hỏi cho Unit này</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Bài tập: {unitTitle}</h1>
            {filterType && (
                <p style={styles.filterInfo}>Đang lọc: <strong>{filterType.replace('_', ' ').toUpperCase()}</strong></p>
            )}
            <p style={styles.hint}>Bấm vào từ để tra nghĩa</p>
            
            {questions.map((q, index) => (
                <div key={q.id} style={styles.questionCard}>
                    <p 
                        onClick={handleWordClick}
                        dangerouslySetInnerHTML={{ 
                            __html: `<strong>Câu ${index + 1}:</strong> ` + 
                                q.content.replace(/\b([a-zA-Z]{3,})\b/g, '<span data-word="$1" style="cursor:pointer;border-bottom:1px dotted #007bff">$1</span>')
                        }}
                    />
                    {/* ... (Các dạng câu hỏi giữ nguyên) ... */}
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
                            placeholder="Nhập đáp án..."
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            style={styles.input}
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
                            style={styles.input}
                        />
                    )}
                </div>
            ))}
            <button onClick={handleSubmit} style={styles.submitButton}>
                Nộp bài
            </button>

            {selectedWord && (
                <DictionaryPopup 
                    word={selectedWord} 
                    onClose={() => setSelectedWord(null)} 
                />
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '40px',
        maxWidth: '900px',
        margin: '0 auto',
        fontFamily: "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },
    textModeContainer: {
        padding: '40px',
        maxWidth: '900px',
        margin: '0 auto',
        fontFamily: "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        backgroundColor: '#F6F9FE',
        minHeight: '100vh'
    },
    header: {
        marginBottom: '30px'
    },
    backButton: {
        padding: '8px 16px',
        backgroundColor: 'white',
        border: '1px solid #CED4DA',
        borderRadius: '8px',
        cursor: 'pointer',
        marginBottom: '16px',
        fontSize: '14px'
    },
    title: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#212529',
        marginBottom: '16px'
    },
    exerciseWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: '30px'
    },
    partBox: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        border: '1px solid #DCE8F5',
        boxShadow: '0 2px 12px rgba(13, 110, 253, 0.06)'
    },
    partTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#0D6EFD',
        marginBottom: '16px'
    },
    partContent: {
        fontSize: '16px',
        color: '#343A40',
        lineHeight: '1.9'
    },
    footer: {
        marginTop: '40px',
        textAlign: 'center'
    },
    filterInfo: {
        backgroundColor: '#E7F1FF',
        color: '#0D6EFD',
        padding: '10px 15px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
        fontWeight: '500'
    },
    hint: {
        backgroundColor: '#FFF3CD',
        color: '#856404',
        padding: '8px 15px',
        borderRadius: '8px',
        fontSize: '14px',
        marginBottom: '20px'
    },
    questionCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '20px',
        borderRadius: '12px',
        border: '2px solid #DCE8F5',
        boxShadow: '0 2px 12px rgba(13, 110, 253, 0.06)',
        marginBottom: '20px'
    },
    option: {
        display: 'block',
        margin: '8px 0',
        cursor: 'pointer',
        fontSize: '15px'
    },
    input: {
        padding: '10px 14px',
        border: '1px solid #CED4DA',
        borderRadius: '8px',
        width: '100%',
        marginTop: '10px',
        fontSize: '15px',
        outline: 'none'
    },
    textarea: {
        padding: '10px 14px',
        border: '1px solid #CED4DA',
        borderRadius: '8px',
        width: '100%',
        marginTop: '10px',
        fontSize: '15px',
        minHeight: '80px',
        outline: 'none',
        fontFamily: 'inherit'
    },
    submitButton: {
        padding: '15px 40px',
        backgroundColor: '#0D6EFD',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        width: '100%',
        marginTop: '10px',
        boxShadow: '0 4px 12px rgba(13, 110, 253, 0.35)'
    },
    resultBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '24px',
        borderRadius: '12px',
        border: '2px solid #DCE8F5',
        textAlign: 'center',
        marginBottom: '20px'
    },
    score: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#28A745',
        margin: '0 0 8px 0'
    },
    pointsEarned: {
        fontSize: '18px',
        color: '#0D6EFD',
        fontWeight: '700',
        marginTop: '10px'
    },
    resultDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '20px'
    },
    resultItem: {
        padding: '15px',
        borderRadius: '8px'
    },
    correct: { backgroundColor: '#D4EDDA' },
    wrong: { backgroundColor: '#F8D7DA' },
    explanation: {
        color: '#6C757D',
        fontStyle: 'italic',
        marginTop: '5px'
    },
    button: {
        padding: '12px 24px',
        backgroundColor: '#6C757D',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 2px 6px rgba(108, 117, 125, 0.25)'
    }
};

export default PracticeZone;