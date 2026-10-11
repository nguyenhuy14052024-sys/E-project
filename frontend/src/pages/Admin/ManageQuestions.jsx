import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUnits, getQuestionsByUnit, createQuestion, updateQuestion, deleteQuestion } from '../../services/adminService';

const ManageQuestions = () => {
    const navigate = useNavigate();
    const [units, setUnits] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState('');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        question_type: 'multiple_choice',
        content: '',
        options: '',
        correct_answer: '',
        explanation: '',
        difficulty: 1
    });

    useEffect(() => {
        fetchUnits();
    }, []);

    useEffect(() => {
        if (selectedUnit) {
            fetchQuestions(selectedUnit);
        } else {
            setQuestions([]);
        }
    }, [selectedUnit]);

    const fetchUnits = async () => {
        try {
            const data = await getAllUnits();
            setUnits(data.units || []);
        } catch (err) {
            setError('Lỗi tải danh sách Unit');
        }
    };

    const fetchQuestions = async (unitId) => {
        setLoading(true);
        try {
            const data = await getQuestionsByUnit(unitId);
            setQuestions(data.questions || []);
        } catch (err) {
            setError('Lỗi tải danh sách câu hỏi');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        let optionsArray = null;
        if (formData.question_type === 'multiple_choice' && formData.options) {
            optionsArray = formData.options.split(',').map(o => o.trim()).filter(o => o);
        }

        const submitData = {
            unit_id: selectedUnit,
            question_type: formData.question_type,
            content: formData.content,
            options: optionsArray,
            correct_answer: formData.correct_answer,
            explanation: formData.explanation,
            difficulty: formData.difficulty
        };

        try {
            if (editingId) {
                await updateQuestion(editingId, submitData);
            } else {
                await createQuestion(submitData);
            }
            resetForm();
            fetchQuestions(selectedUnit);
        } catch (err) {
            setError(err.message || 'Lỗi lưu câu hỏi');
        }
    };

    const handleEdit = (q) => {
        setEditingId(q.id);
        setFormData({
            question_type: q.question_type,
            content: q.content,
            options: q.options ? q.options.join(', ') : '',
            correct_answer: q.correct_answer,
            explanation: q.explanation || '',
            difficulty: q.difficulty || 1
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
            try {
                await deleteQuestion(id);
                fetchQuestions(selectedUnit);
            } catch (err) {
                setError('Lỗi xóa câu hỏi');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            question_type: 'multiple_choice',
            content: '',
            options: '',
            correct_answer: '',
            explanation: '',
            difficulty: 1
        });
        setShowForm(false);
        setEditingId(null);
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Quản lý câu hỏi</h1>
                    <button onClick={() => navigate('/admin')} style={styles.backButton}>
                        ← Về Admin
                    </button>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                <div style={styles.unitSelector}>
                    <label style={styles.label}>Chọn Unit:</label>
                    <select
                        value={selectedUnit}
                        onChange={(e) => setSelectedUnit(e.target.value)}
                        style={styles.select}
                    >
                        <option value="">-- Chọn Unit --</option>
                        {units.map(u => (
                            <option key={u.id} value={u.id}>
                                [{u.book_level}] Unit {u.unit_number}: {u.title}
                            </option>
                        ))}
                    </select>
                    {selectedUnit && (
                        <button 
                            onClick={() => { resetForm(); setShowForm(!showForm); }} 
                            style={styles.addButton}
                        >
                            {showForm ? 'Đóng' : '+ Thêm câu hỏi'}
                        </button>
                    )}
                </div>

                {showForm && selectedUnit && (
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Loại câu hỏi</label>
                            <select
                                value={formData.question_type}
                                onChange={(e) => setFormData({ ...formData, question_type: e.target.value })}
                                style={styles.input}
                            >
                                <option value="multiple_choice">Trắc nghiệm (ABCD)</option>
                                <option value="gap_filling">Điền từ</option>
                                <option value="word_formation">Biến đổi từ</option>
                                <option value="sentence_transformation">Viết lại câu</option>
                                <option value="error_correction">Sửa lỗi</option>
                                <option value="collocation">Collocations</option>
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Nội dung câu hỏi</label>
                            <textarea
                                placeholder="Nhập nội dung câu hỏi"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                style={styles.textarea}
                                rows="3"
                                required
                            />
                        </div>

                        {formData.question_type === 'multiple_choice' && (
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Các lựa chọn (phân cách bằng dấu phẩy)</label>
                                <input
                                    type="text"
                                    placeholder="go, goes, going"
                                    value={formData.options}
                                    onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                                    style={styles.input}
                                />
                            </div>
                        )}

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Đáp án đúng</label>
                            <input
                                type="text"
                                placeholder="Nhập đáp án đúng"
                                value={formData.correct_answer}
                                onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                                style={styles.input}
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Giải thích đáp án</label>
                            <textarea
                                placeholder="Nhập giải thích"
                                value={formData.explanation}
                                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                                style={styles.textarea}
                                rows="2"
                            />
                        </div>

                        <button type="submit" style={styles.submitButton}>
                            {editingId ? 'Cập nhật' : 'Thêm câu hỏi'}
                        </button>
                    </form>
                )}

                {loading ? (
                    <div style={styles.loadingWrapper}>
                        <div style={styles.spinner}></div>
                        <p style={styles.loadingText}>Đang tải...</p>
                    </div>
                ) : !selectedUnit ? (
                    <div style={styles.emptyState}>Chọn một Unit để xem câu hỏi</div>
                ) : questions.length === 0 ? (
                    <div style={styles.emptyState}>Unit này chưa có câu hỏi nào</div>
                ) : (
                    <div style={styles.questionList}>
                        {questions.map((q, index) => (
                            <div key={q.id} style={styles.questionCard}>
                                <div style={styles.questionHeader}>
                                    <span style={styles.questionType}>
                                        {q.question_type.replace('_', ' ').toUpperCase()}
                                    </span>
                                    <div style={styles.actions}>
                                        <button onClick={() => handleEdit(q)} style={styles.editButton}>Sửa</button>
                                        <button onClick={() => handleDelete(q.id)} style={styles.deleteButton}>Xóa</button>
                                    </div>
                                </div>
                                <p style={styles.questionContent}>
                                    <strong>Câu {index + 1}:</strong> {q.content}
                                </p>
                                {q.options && (
                                    <p style={styles.options}>
                                        <strong>Lựa chọn:</strong> {q.options.join(' | ')}
                                    </p>
                                )}
                                <p style={styles.correctAnswer}>
                                    <strong>Đáp án:</strong> {q.correct_answer}
                                </p>
                                {q.explanation && (
                                    <p style={styles.explanation}>
                                        <strong>Giải thích:</strong> {q.explanation}
                                    </p>
                                )}
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
        padding: '40px 24px'
    },
    container: {
        maxWidth: '1000px',
        margin: '0 auto'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
    },
    title: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#212529',
        margin: 0
    },
    backButton: {
        padding: '10px 20px',
        backgroundColor: '#6C757D',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500'
    },
    unitSelector: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        padding: '16px 20px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        border: '2px solid #DCE8F5',
        flexWrap: 'wrap'
    },
    select: {
        padding: '10px 16px',
        borderRadius: '8px',
        border: '1px solid #CED4DA',
        fontSize: '14px',
        flex: 1,
        outline: 'none',
        backgroundColor: '#F8F9FA',
        cursor: 'pointer'
    },
    addButton: {
        padding: '10px 20px',
        backgroundColor: '#0D6EFD',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500'
    },
    form: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '24px',
        borderRadius: '12px',
        border: '2px solid #DCE8F5',
        marginBottom: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
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
        padding: '12px 16px',
        border: '1px solid #CED4DA',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: '#F8F9FA',
        width: '100%',
        boxSizing: 'border-box'
    },
    textarea: {
        padding: '12px 16px',
        border: '1px solid #CED4DA',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: '#F8F9FA',
        fontFamily: 'inherit',
        width: '100%',
        minHeight: '80px',
        resize: 'vertical',
        boxSizing: 'border-box'
    },
    submitButton: {
        padding: '14px',
        backgroundColor: '#28A745',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(40, 167, 69, 0.35)'
    },
    questionList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    questionCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '20px',
        borderRadius: '12px',
        border: '2px solid #DCE8F5',
        boxShadow: '0 2px 12px rgba(13, 110, 253, 0.06)'
    },
    questionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
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
    actions: {
        display: 'flex',
        gap: '8px'
    },
    editButton: {
        padding: '6px 14px',
        backgroundColor: '#FFC107',
        color: '#333',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500'
    },
    deleteButton: {
        padding: '6px 14px',
        backgroundColor: '#DC3545',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500'
    },
    questionContent: {
        fontSize: '15px',
        color: '#212529',
        margin: '0 0 8px 0',
        lineHeight: '1.6'
    },
    options: {
        fontSize: '14px',
        color: '#6C757D',
        margin: '4px 0'
    },
    correctAnswer: {
        fontSize: '14px',
        color: '#28A745',
        margin: '4px 0'
    },
    explanation: {
        fontSize: '13px',
        color: '#6C757D',
        fontStyle: 'italic',
        margin: '4px 0'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 40px',
        color: '#6C757D',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        border: '2px solid #DCE8F5'
    },
    error: {
        backgroundColor: '#F8D7DA',
        color: '#721C24',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '14px'
    },
    loadingWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '60px 20px',
        gap: '16px'
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #DCE8F5',
        borderTop: '4px solid #0D6EFD',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
    },
    loadingText: {
        color: '#6C757D',
        fontSize: '14px',
        margin: 0
    }
};

if (typeof document !== 'undefined') {
    const existing = document.getElementById('manageq-keyframes');
    if (!existing) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'manageq-keyframes';
        styleSheet.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

export default ManageQuestions;