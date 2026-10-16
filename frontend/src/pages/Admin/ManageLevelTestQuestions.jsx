import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    getLevelTestById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    createPassage,
    updatePassage,
    deletePassage
} from '../../services/levelTestService';

const QUESTION_GROUPS = [
    { value: 'pronunciation', label: 'Phát âm (Pronunciation)' },
    { value: 'word_stress', label: 'Trọng âm (Word Stress)' },
    { value: 'sentence_completion', label: 'Hoàn thành câu' },
    { value: 'synonym_antonym', label: 'Đồng nghĩa / Trái nghĩa' },
    { value: 'communication', label: 'Giao tiếp' },
    { value: 'cloze_test', label: 'Cloze Test' },
    { value: 'reading_comprehension', label: 'Reading Comprehension' },
    { value: 'true_false', label: 'True / False' },
    { value: 'error_identification', label: 'Tìm lỗi sai' },
    { value: 'sentence_transformation', label: 'Viết lại câu' },
    { value: 'sentence_combination', label: 'Nối câu' }
];

const ManageLevelTestQuestions = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [passages, setPassages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form câu hỏi
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [questionData, setQuestionData] = useState({
        question_group: 'pronunciation',
        content: '',
        options: ['', '', '', ''],
        correct_answer: 'A',
        explanation: '',
        score: 1,
        order: 0,
        passage_id: ''
    });

    // Form bài đọc
    const [showPassageForm, setShowPassageForm] = useState(false);
    const [editingPassageId, setEditingPassageId] = useState(null);
    const [passageData, setPassageData] = useState({
        title: '',
        content: '',
        image_url: '',
        image_width: '100%',
        source: ''
    });

    useEffect(() => {
        fetchTest();
    }, [testId]);

    const fetchTest = async () => {
        setLoading(true);
        try {
            const data = await getLevelTestById(testId);
            setTest(data.test);
            setQuestions(data.test.questions || []);
            setPassages(data.test.passages || []);
        } catch (err) {
            setError('Lỗi tải bài test');
        } finally {
            setLoading(false);
        }
    };

    // ==================== CÂU HỎI ====================

    const resetQuestionForm = () => {
        setQuestionData({
            question_group: 'pronunciation',
            content: '',
            options: ['', '', '', ''],
            correct_answer: 'A',
            explanation: '',
            score: 1,
            order: questions.length + 1,
            passage_id: ''
        });
        setEditingQuestionId(null);
        setShowQuestionForm(false);
    };

    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const submitData = {
            ...questionData,
            level_test_id: testId,
            options: questionData.options.filter(o => o.trim() !== ''),
            passage_id: questionData.passage_id || null
        };

        try {
            if (editingQuestionId) {
                await updateQuestion(editingQuestionId, submitData);
            } else {
                await createQuestion(submitData);
            }
            resetQuestionForm();
            fetchTest();
        } catch (err) {
            setError(err.message || 'Lỗi lưu câu hỏi');
        }
    };

    const handleEditQuestion = (q) => {
    setEditingQuestionId(q.id);
    const opts = q.options || [];
    setQuestionData({
        question_group: q.question_group,
        content: q.content,
        options: [
            opts[0] || '',
            opts[1] || '',
            opts[2] || '',
            opts[3] || ''
        ],
        correct_answer: q.correct_answer,
        explanation: q.explanation || '',
        score: q.score || 1,
        order: q.order || 0,
        passage_id: q.passage_id || ''
    });
    setShowQuestionForm(true);
};
    const handleDeleteQuestion = async (id) => {
        if (window.confirm('Xóa câu hỏi này?')) {
            try {
                await deleteQuestion(id);
                fetchTest();
            } catch (err) {
                setError('Lỗi xóa câu hỏi');
            }
        }
    };

    // ==================== BÀI ĐỌC ====================

    const resetPassageForm = () => {
        setPassageData({
            title: '',
            content: '',
            image_url: '',
            image_width: '100%',
            source: ''
        });
        setEditingPassageId(null);
        setShowPassageForm(false);
    };

    const handlePassageSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const submitData = {
            ...passageData,
            level_test_id: testId
        };

        try {
            if (editingPassageId) {
                await updatePassage(editingPassageId, submitData);
            } else {
                await createPassage(submitData);
            }
            resetPassageForm();
            fetchTest();
        } catch (err) {
            setError(err.message || 'Lỗi lưu bài đọc');
        }
    };

    const handleEditPassage = (p) => {
        setEditingPassageId(p.id);
        setPassageData({
            title: p.title || '',
            content: p.content,
            image_url: p.image_url || '',
            image_width: p.image_width || '100%',
            source: p.source || ''
        });
        setShowPassageForm(true);
    };

    const handleDeletePassage = async (id) => {
        if (window.confirm('Xóa bài đọc này? Các câu hỏi liên quan vẫn giữ nhưng sẽ mất liên kết.')) {
            try {
                await deletePassage(id);
                fetchTest();
            } catch (err) {
                setError('Lỗi xóa bài đọc');
            }
        }
    };

    const updateOption = (index, value) => {
        const newOptions = [...questionData.options];
        newOptions[index] = value;
        setQuestionData({ ...questionData, options: newOptions });
    };

    if (loading) return <div style={styles.page}><div style={styles.container}>Đang tải...</div></div>;
    if (!test) return <div style={styles.page}><div style={styles.container}>Không tìm thấy bài test</div></div>;

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>{test.title}</h1>
                        <p style={styles.subtitle}>
                            Level {test.book_level} | {test.total_score} điểm | {test.duration} phút
                        </p>
                    </div>
                    <button onClick={() => navigate('/admin/level-tests')} style={styles.backButton}>
                        ← Về danh sách
                    </button>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                {/* ==================== BÀI ĐỌC ==================== */}
                <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>Bài đọc ({passages.length})</h2>
                        <button
                            onClick={() => { resetPassageForm(); setShowPassageForm(!showPassageForm); }}
                            style={styles.addButton}
                        >
                            {showPassageForm ? 'Đóng' : '+ Thêm bài đọc'}
                        </button>
                    </div>

                    {showPassageForm && (
                        <form onSubmit={handlePassageSubmit} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Tiêu đề</label>
                                <input
                                    type="text"
                                    value={passageData.title}
                                    onChange={(e) => setPassageData({ ...passageData, title: e.target.value })}
                                    style={styles.input}
                                    placeholder="VD: The History of Coffee"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Nội dung *</label>
                                <textarea
                                    value={passageData.content}
                                    onChange={(e) => setPassageData({ ...passageData, content: e.target.value })}
                                    style={styles.textarea}
                                    rows="6"
                                    required
                                />
                            </div>
                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Link ảnh</label>
                                    <input
                                        type="text"
                                        value={passageData.image_url}
                                        onChange={(e) => setPassageData({ ...passageData, image_url: e.target.value })}
                                        style={styles.input}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Độ rộng ảnh</label>
                                    <select
                                        value={passageData.image_width}
                                        onChange={(e) => setPassageData({ ...passageData, image_width: e.target.value })}
                                        style={styles.input}
                                    >
                                        <option value="25%">25%</option>
                                        <option value="50%">50%</option>
                                        <option value="75%">75%</option>
                                        <option value="100%">100%</option>
                                    </select>
                                </div>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Nguồn (chữ nhỏ)</label>
                                <input
                                    type="text"
                                    value={passageData.source}
                                    onChange={(e) => setPassageData({ ...passageData, source: e.target.value })}
                                    style={styles.input}
                                    placeholder="VD: Adapted from BBC News"
                                />
                            </div>
                            <button type="submit" style={styles.submitButton}>
                                {editingPassageId ? 'Cập nhật bài đọc' : 'Thêm bài đọc'}
                            </button>
                        </form>
                    )}

                    {passages.length > 0 && (
                        <div style={styles.passageList}>
                            {passages.map(p => (
                                <div key={p.id} style={styles.passageCard}>
                                    <div style={styles.passageHeader}>
                                        <strong>{p.title || '(Không tiêu đề)'}</strong>
                                        <div>
                                            <button onClick={() => handleEditPassage(p)} style={styles.editButton}>Sửa</button>
                                            <button onClick={() => handleDeletePassage(p.id)} style={styles.deleteButton}>Xóa</button>
                                        </div>
                                    </div>
                                    <p style={styles.passageContent}>{p.content.substring(0, 120)}...</p>
                                    {p.source && <p style={styles.passageSource}>Source: {p.source}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ==================== CÂU HỎI ==================== */}
                <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>Câu hỏi ({questions.length})</h2>
                        <button
                            onClick={() => { resetQuestionForm(); setShowQuestionForm(!showQuestionForm); }}
                            style={styles.addButton}
                        >
                            {showQuestionForm ? 'Đóng' : '+ Thêm câu hỏi'}
                        </button>
                    </div>

                    {showQuestionForm && (
                        <form onSubmit={handleQuestionSubmit} style={styles.form}>
                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Dạng bài</label>
                                    <select
                                        value={questionData.question_group}
                                        onChange={(e) => setQuestionData({ ...questionData, question_group: e.target.value })}
                                        style={styles.input}
                                    >
                                        {QUESTION_GROUPS.map(g => (
                                            <option key={g.value} value={g.value}>{g.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Điểm</label>
                                    <input
                                        type="number"
                                        value={questionData.score}
                                        onChange={(e) => setQuestionData({ ...questionData, score: parseFloat(e.target.value) })}
                                        style={styles.input}
                                        step="0.5"
                                        min="0.5"
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Thứ tự</label>
                                    <input
                                        type="number"
                                        value={questionData.order}
                                        onChange={(e) => setQuestionData({ ...questionData, order: parseInt(e.target.value) })}
                                        style={styles.input}
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Nội dung câu hỏi *</label>
                                <ReactQuill
                                    theme="snow"
                                    value={questionData.content}
                                    onChange={(value) => setQuestionData({ ...questionData, content: value })}
                                    placeholder="Nhập nội dung câu hỏi. Dùng nút U để gạch chân phần cần thiết."
                                    modules={{
                                        toolbar: [
                                            ['bold', 'italic', 'underline', 'strike'],
                                            [{ color: [] }, { background: [] }],
                                            ['clean']
                                        ]
                                    }}
                                    style={styles.quill}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Các lựa chọn</label>
                                {['A', 'B', 'C', 'D'].map((label, idx) => (
                                    <div key={idx} style={styles.optionRow}>
                                        <span style={styles.optionLabel}>{label}.</span>
                                        <input
                                            type="text"
                                            value={questionData.options[idx]}
                                            onChange={(e) => updateOption(idx, e.target.value)}
                                            style={styles.input}
                                            placeholder={`Lựa chọn ${label}`}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Đáp án đúng *</label>
                                    <select
                                        value={questionData.correct_answer}
                                        onChange={(e) => setQuestionData({ ...questionData, correct_answer: e.target.value })}
                                        style={styles.input}
                                    >
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                    </select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Bài đọc liên quan (nếu có)</label>
                                    <select
                                        value={questionData.passage_id}
                                        onChange={(e) => setQuestionData({ ...questionData, passage_id: e.target.value })}
                                        style={styles.input}
                                    >
                                        <option value="">-- Không --</option>
                                        {passages.map(p => (
                                            <option key={p.id} value={p.id}>{p.title || '(Không tiêu đề)'}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Giải thích đáp án</label>
                                <textarea
                                    value={questionData.explanation}
                                    onChange={(e) => setQuestionData({ ...questionData, explanation: e.target.value })}
                                    style={styles.textarea}
                                    rows="2"
                                    placeholder="VD: 'wanted' có /ɪd/, các từ khác có /t/"
                                />
                            </div>

                            <button type="submit" style={styles.submitButton}>
                                {editingQuestionId ? 'Cập nhật câu hỏi' : 'Thêm câu hỏi'}
                            </button>
                        </form>
                    )}

                    {questions.length > 0 && (
                        <div style={styles.questionList}>
                            {questions.map((q, idx) => (
                                <div key={q.id} style={styles.questionCard}>
                                    <div style={styles.questionHeader}>
                                        <span style={styles.questionNumber}>Câu {idx + 1}</span>
                                        <span style={styles.questionGroup}>
                                            {QUESTION_GROUPS.find(g => g.value === q.question_group)?.label || q.question_group}
                                        </span>
                                        <div>
                                            <button onClick={() => handleEditQuestion(q)} style={styles.editButton}>Sửa</button>
                                            <button onClick={() => handleDeleteQuestion(q.id)} style={styles.deleteButton}>Xóa</button>
                                        </div>
                                    </div>
                                    <div
                                        style={styles.questionContent}
                                        dangerouslySetInnerHTML={{ __html: q.content }}
                                    />
                                    {q.options && (
                                        <div style={styles.optionsDisplay}>
                                            {q.options.map((opt, i) => (
                                                <span key={i} style={styles.optionDisplay}>
                                                    {String.fromCharCode(65 + i)}. {opt}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <p style={styles.correctAnswer}>Đáp án: <strong>{q.correct_answer}</strong> | Điểm: {q.score}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#F6F9FE',
        fontFamily: "'Inter', 'Roboto', sans-serif",
        padding: '40px 20px',
        boxSizing: 'border-box'
    },
    container: {
        maxWidth: '1000px',
        margin: '0 auto',
        width: '100%'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
    },
    title: {
        fontSize: 'clamp(20px, 5vw, 26px)',
        fontWeight: '800',
        color: '#212529',
        margin: 0
    },
    subtitle: {
        fontSize: '14px',
        color: '#6C757D',
        marginTop: '4px'
    },
    backButton: {
        padding: '10px 20px',
        backgroundColor: '#6C757D',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    section: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        border: '2px solid #DCE8F5',
        marginBottom: '24px',
        boxShadow: '0 2px 12px rgba(13, 110, 253, 0.06)'
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px'
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#212529',
        margin: 0
    },
    addButton: {
        padding: '8px 16px',
        backgroundColor: '#0D6EFD',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500'
    },
    form: {
        backgroundColor: '#F8F9FA',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#495057'
    },
    input: {
        padding: '10px 14px',
        border: '1px solid #CED4DA',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: 'white',
        width: '100%',
        boxSizing: 'border-box'
    },
    textarea: {
        padding: '10px 14px',
        border: '1px solid #CED4DA',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: 'white',
        fontFamily: 'inherit',
        resize: 'vertical',
        width: '100%',
        boxSizing: 'border-box'
    },
    quill: {
        backgroundColor: 'white',
        borderRadius: '8px',
        marginBottom: '8px',
        minHeight: '100px'
    },
    optionRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '6px'
    },
    optionLabel: {
        fontWeight: '700',
        color: '#0D6EFD',
        width: '24px'
    },
    submitButton: {
        padding: '12px',
        backgroundColor: '#28A745',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    passageList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    passageCard: {
        backgroundColor: '#F8F9FA',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #DCE8F5'
    },
    passageHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
        gap: '8px',
        flexWrap: 'wrap'
    },
    passageContent: {
        fontSize: '13px',
        color: '#495057',
        margin: '4px 0',
        lineHeight: '1.5'
    },
    passageSource: {
        fontSize: '12px',
        color: '#6C757D',
        fontStyle: 'italic',
        margin: 0
    },
    questionList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    questionCard: {
        backgroundColor: '#F8F9FA',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #DCE8F5'
    },
    questionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
        gap: '8px',
        flexWrap: 'wrap'
    },
    questionNumber: {
        fontWeight: '700',
        color: '#0D6EFD'
    },
    questionGroup: {
        fontSize: '11px',
        backgroundColor: '#E7F1FF',
        color: '#0D6EFD',
        padding: '3px 10px',
        borderRadius: '20px',
        fontWeight: '600'
    },
    questionContent: {
        fontSize: '14px',
        color: '#212529',
        margin: '8px 0',
        lineHeight: '1.6'
    },
    optionsDisplay: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginTop: '6px'
    },
    optionDisplay: {
        fontSize: '13px',
        color: '#495057',
        backgroundColor: 'white',
        padding: '4px 10px',
        borderRadius: '4px',
        border: '1px solid #DCE8F5'
    },
    correctAnswer: {
        fontSize: '13px',
        color: '#28A745',
        marginTop: '8px',
        fontWeight: '600'
    },
    editButton: {
        padding: '4px 10px',
        backgroundColor: '#FFC107',
        color: '#333',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px',
        marginRight: '6px'
    },
    deleteButton: {
        padding: '4px 10px',
        backgroundColor: '#DC3545',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px'
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

export default ManageLevelTestQuestions;