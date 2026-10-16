import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getAllLevelTests,
    createLevelTest,
    updateLevelTest,
    deleteLevelTest
} from '../../services/levelTestService';

const ManageLevelTests = () => {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        book_level: 'B2',
        title: '',
        description: '',
        total_score: 100,
        duration: 60
    });

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        setLoading(true);
        try {
            const data = await getAllLevelTests();
            setTests(data.tests || []);
        } catch (err) {
            setError('Lỗi tải danh sách Level Test');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (editingId) {
                await updateLevelTest(editingId, formData);
            } else {
                await createLevelTest(formData);
            }
            resetForm();
            fetchTests();
        } catch (err) {
            setError(err.message || 'Lỗi lưu Level Test');
        }
    };

    const handleEdit = (test) => {
        setEditingId(test.id);
        setFormData({
            book_level: test.book_level,
            title: test.title,
            description: test.description || '',
            total_score: test.total_score,
            duration: test.duration
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa Level Test này? Tất cả câu hỏi và bài đọc cũng sẽ bị xóa.')) {
            try {
                await deleteLevelTest(id);
                fetchTests();
            } catch (err) {
                setError('Lỗi xóa Level Test');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            book_level: 'B2',
            title: '',
            description: '',
            total_score: 100,
            duration: 60
        });
        setShowForm(false);
        setEditingId(null);
    };

    if (loading) {
        return (
            <div style={styles.page}>
                <div style={styles.container}>
                    <div style={styles.loadingWrapper}>
                        <div style={styles.spinner}></div>
                        <p style={styles.loadingText}>Đang tải...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Quản lý Level Test</h1>
                    <div>
                        <button onClick={() => navigate('/admin')} style={styles.backButton}>
                            ← Về Admin
                        </button>
                        <button
                            onClick={() => { resetForm(); setShowForm(!showForm); }}
                            style={styles.addButton}
                        >
                            {showForm ? 'Đóng' : '+ Tạo bài test'}
                        </button>
                    </div>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                {showForm && (
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Trình độ</label>
                                <select
                                    value={formData.book_level}
                                    onChange={(e) => setFormData({ ...formData, book_level: e.target.value })}
                                    style={styles.input}
                                >
                                    <option value="A1">A1</option>
                                    <option value="A2">A2</option>
                                    <option value="B1">B1</option>
                                    <option value="B2">B2</option>
                                    <option value="C1">C1</option>
                                </select>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Tổng điểm</label>
                                <input
                                    type="number"
                                    value={formData.total_score}
                                    onChange={(e) => setFormData({ ...formData, total_score: parseInt(e.target.value) })}
                                    style={styles.input}
                                    min="1"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Thời gian (phút)</label>
                                <input
                                    type="number"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                    style={styles.input}
                                    min="1"
                                />
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Tên bài test</label>
                            <input
                                type="text"
                                placeholder="VD: B2 Level Test 1"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                style={styles.input}
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Mô tả</label>
                            <textarea
                                placeholder="Mô tả ngắn về bài test"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                style={styles.textarea}
                                rows="3"
                            />
                        </div>

                        <button type="submit" style={styles.submitButton}>
                            {editingId ? 'Cập nhật' : 'Tạo bài test'}
                        </button>
                    </form>
                )}

                {tests.length === 0 ? (
                    <div style={styles.emptyState}>Chưa có bài test nào</div>
                ) : (
                    <div style={styles.testList}>
                        {tests.map((test) => (
                            <div key={test.id} style={styles.testCard}>
                                <div style={styles.testHeader}>
                                    <div>
                                        <span style={styles.levelBadge}>{test.book_level}</span>
                                        <h3 style={styles.testTitle}>{test.title}</h3>
                                    </div>
                                    <div style={styles.actions}>
                                        <button
                                            onClick={() => navigate(`/admin/level-tests/${test.id}`)}
                                            style={styles.manageButton}
                                        >
                                            Quản lý câu hỏi
                                        </button>
                                        <button onClick={() => handleEdit(test)} style={styles.editButton}>
                                            Sửa
                                        </button>
                                        <button onClick={() => handleDelete(test.id)} style={styles.deleteButton}>
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                                <p style={styles.testDesc}>{test.description}</p>
                                <div style={styles.testMeta}>
                                    <span>Tổng điểm: {test.total_score}</span>
                                    <span>Thời gian: {test.duration} phút</span>
                                    <span>Câu hỏi: {test.questionCount || 0}</span>
                                    <span>Lượt làm: {test.attemptCount || 0}</span>
                                </div>
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
        padding: '40px 20px',
        width: '100%',
        maxWidth: '100vw',
        boxSizing: 'border-box'
    },
    container: {
        maxWidth: '1100px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
    },
    title: {
        fontSize: 'clamp(22px, 5vw, 28px)',
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
        marginRight: '10px',
        fontSize: '14px'
    },
    addButton: {
        padding: '10px 20px',
        backgroundColor: '#0D6EFD',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px'
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
    formRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
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
        cursor: 'pointer'
    },
    testList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    testCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '20px',
        borderRadius: '12px',
        border: '2px solid #DCE8F5',
        boxShadow: '0 2px 12px rgba(13, 110, 253, 0.06)'
    },
    testHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
        gap: '12px',
        flexWrap: 'wrap'
    },
    levelBadge: {
        display: 'inline-block',
        padding: '3px 10px',
        backgroundColor: '#0D6EFD',
        color: 'white',
        borderRadius: '3px',
        fontSize: '12px',
        fontWeight: '700',
        marginRight: '8px'
    },
    testTitle: {
        display: 'inline',
        fontSize: '18px',
        fontWeight: '700',
        color: '#212529',
        margin: 0
    },
    testDesc: {
        color: '#6C757D',
        fontSize: '14px',
        margin: '0 0 12px 0'
    },
    testMeta: {
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        fontSize: '13px',
        color: '#6C757D'
    },
    actions: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap'
    },
    manageButton: {
        padding: '6px 12px',
        backgroundColor: '#17A2B8',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px'
    },
    editButton: {
        padding: '6px 12px',
        backgroundColor: '#FFC107',
        color: '#333',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px'
    },
    deleteButton: {
        padding: '6px 12px',
        backgroundColor: '#DC3545',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 40px',
        color: '#6C757D',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        border: '2px dashed #DCE8F5'
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
    const existing = document.getElementById('manageleveltests-keyframes');
    if (!existing) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'manageleveltests-keyframes';
        styleSheet.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

export default ManageLevelTests;