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

        // Chuyển options từ string sang mảng
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
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>❓ Quản lý câu hỏi</h1>
                <button onClick={() => navigate('/admin')} style={styles.backButton}>
                    ← Về Admin
                </button>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.unitSelector}>
                <label>Chọn Unit:</label>
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
                    <button onClick={() => { resetForm(); setShowForm(!showForm); }} style={styles.addButton}>
                        {showForm ? 'Đóng' : '+ Thêm câu hỏi'}
                    </button>
                )}
            </div>

            {showForm && selectedUnit && (
                <form onSubmit={handleSubmit} style={styles.form}>
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

                    <textarea
                        placeholder="Nội dung câu hỏi *"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        style={styles.textarea}
                        rows="3"
                        required
                    />

                    {formData.question_type === 'multiple_choice' && (
                        <input
                            type="text"
                            placeholder="Các lựa chọn (phân cách bởi dấu phẩy): go, goes, going"
                            value={formData.options}
                            onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                            style={styles.input}
                        />
                    )}

                    <input
                        type="text"
                        placeholder="Đáp án đúng *"
                        value={formData.correct_answer}
                        onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                        style={styles.input}
                        required
                    />

                    <textarea
                        placeholder="Giải thích đáp án"
                        value={formData.explanation}
                        onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                        style={styles.textarea}
                        rows="2"
                    />

                    <button type="submit" style={styles.submitButton}>
                        {editingId ? 'Cập nhật' : 'Thêm câu hỏi'}
                    </button>
                </form>
            )}

            {loading ? (
                <p>Đang tải...</p>
            ) : !selectedUnit ? (
                <div style={styles.emptyState}>Chọn một Unit để xem câu hỏi</div>
            ) : questions.length === 0 ? (
                <div style={styles.emptyState}>Unit này chưa có câu hỏi nào</div>
            ) : (
                <div style={styles.questionList}>
                    {questions.map((q, index) => (
                        <div key={q.id} style={styles.questionCard}>
                            <div style={styles.questionHeader}>
                                <span style={styles.questionType}>{q.question_type}</span>
                                <div>
                                    <button onClick={() => handleEdit(q)} style={styles.editButton}>✏️</button>
                                    <button onClick={() => handleDelete(q.id)} style={styles.deleteButton}>🗑️</button>
                                </div>
                            </div>
                            <p><strong>Câu {index + 1}:</strong> {q.content}</p>
                            {q.options && (
                                <p style={styles.options}>Lựa chọn: {q.options.join(' | ')}</p>
                            )}
                            <p style={styles.correctAnswer}>✅ Đáp án: {q.correct_answer}</p>
                            {q.explanation && <p style={styles.explanation}>💡 {q.explanation}</p>}
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
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    backButton: {
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    unitSelector: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
    },
    select: {
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '14px',
        flex: 1
    },
    addButton: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    form: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    input: {
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '14px'
    },
    textarea: {
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '14px',
        fontFamily: 'Arial'
    },
    submitButton: {
        padding: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    questionList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    questionCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    questionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
    },
    questionType: {
        padding: '3px 10px',
        backgroundColor: '#e9ecef',
        borderRadius: '3px',
        fontSize: '12px'
    },
    options: {
        color: '#666',
        fontSize: '14px',
        marginTop: '5px'
    },
    correctAnswer: {
        color: '#28a745',
        fontSize: '14px',
        marginTop: '5px'
    },
    explanation: {
        color: '#666',
        fontStyle: 'italic',
        fontSize: '14px',
        marginTop: '5px'
    },
    editButton: {
        padding: '5px 10px',
        backgroundColor: '#ffc107',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        marginRight: '5px'
    },
    deleteButton: {
        padding: '5px 10px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer'
    },
    error: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px'
    },
    emptyState: {
        textAlign: 'center',
        padding: '40px',
        color: '#666'
    }
};

export default ManageQuestions;