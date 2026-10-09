import React, { useState, useEffect } from 'react';
import { getFlashcards, createFlashcard, deleteFlashcard, updateFlashcard } from '../services/flashcardService';

const FlashcardPage = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        word: '',
        definition: '',
        example: '',
        unitId: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchFlashcards();
    }, []);

    const fetchFlashcards = async () => {
        setLoading(true);
        try {
            const data = await getFlashcards();
            setFlashcards(data.flashcards || []);
        } catch (err) {
            setError('Lỗi tải danh sách flashcard');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (editingId) {
                await updateFlashcard(editingId, formData);
            } else {
                await createFlashcard(formData);
            }
            setFormData({ word: '', definition: '', example: '', unitId: '' });
            setShowForm(false);
            setEditingId(null);
            fetchFlashcards();
        } catch (err) {
            setError(err.message || 'Lỗi lưu flashcard');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa flashcard này?')) {
            try {
                await deleteFlashcard(id);
                fetchFlashcards();
            } catch (err) {
                setError('Lỗi xóa flashcard');
            }
        }
    };

    const handleEdit = (flashcard) => {
        setEditingId(flashcard.id);
        setFormData({
            word: flashcard.word,
            definition: flashcard.definition,
            example: flashcard.example || '',
            unitId: flashcard.unit_id || ''
        });
        setShowForm(true);
    };

    if (loading) return <div style={styles.container}>Đang tải...</div>;

    return (
        <div style={styles.page}>
            <div style={styles.bgShape1}></div>
            <div style={styles.bgShape2}></div>

            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.pageTitle}> Flashcard</h1>
                    <button
                        onClick={() => {
                            setShowForm(!showForm);
                            setEditingId(null);
                            setFormData({ word: '', definition: '', example: '', unitId: '' });
                        }}
                        style={styles.addButton}
                    >
                        {showForm ? 'Đóng' : '+ Thêm mới'}
                    </button>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                {showForm && (
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <input
                            type="text"
                            placeholder="Từ vựng *"
                            value={formData.word}
                            onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                            style={styles.input}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Định nghĩa *"
                            value={formData.definition}
                            onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
                            style={styles.input}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Ví dụ (không bắt buộc)"
                            value={formData.example}
                            onChange={(e) => setFormData({ ...formData, example: e.target.value })}
                            style={styles.input}
                        />
                        <button type="submit" style={styles.submitButton}>
                            {editingId ? 'Cập nhật' : 'Thêm flashcard'}
                        </button>
                    </form>
                )}

                {flashcards.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p>Chưa có flashcard nào. Hãy thêm từ vựng mới!</p>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {flashcards.map((card) => (
                            <div
                                key={card.id}
                                style={styles.card}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(13, 110, 253, 0.20)';
                                    e.currentTarget.style.borderColor = '#0D6EFD';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(13, 110, 253, 0.06)';
                                    e.currentTarget.style.borderColor = '#DCE8F5';
                                }}
                            >
                                <div style={styles.cardContent}>
                                    <h3 style={styles.word}>{card.word}</h3>
                                    <p style={styles.definition}>{card.definition}</p>
                                    {card.example && <p style={styles.example}> {card.example}</p>}
                                    <div style={styles.cardMeta}>
                                        <span style={styles.nextReview}>
                                             Ôn: {new Date(card.next_review).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                </div>
                                <div style={styles.cardActions}>
                                    <button onClick={() => handleEdit(card)} style={styles.editButton}>✏️</button>
                                    <button onClick={() => handleDelete(card.id)} style={styles.deleteButton}>🗑️</button>
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
        fontFamily: "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: 'relative',
        overflow: 'hidden'
    },
    bgShape1: {
        position: 'fixed',
        top: '-120px',
        right: '-120px',
        width: '460px',
        height: '460px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13, 110, 253, 0.12) 0%, rgba(13, 110, 253, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
    },
    bgShape2: {
        position: 'fixed',
        bottom: '-160px',
        left: '-100px',
        width: '520px',
        height: '520px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13, 110, 253, 0.08) 0%, rgba(13, 110, 253, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
    },
    container: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '40px',
        position: 'relative',
        zIndex: 1
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
    },
    pageTitle: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#212529',
        margin: 0
    },
    addButton: {
        padding: '10px 20px',
        backgroundColor: '#0D6EFD',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 2px 6px rgba(13, 110, 253, 0.25)',
        transition: 'all 0.25s ease'
    },
    form: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        padding: '24px',
        borderRadius: '12px',
        border: '2px solid #DCE8F5',
        boxShadow: '0 2px 12px rgba(13, 110, 253, 0.06)',
        marginBottom: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    input: {
        padding: '12px 16px',
        border: '1px solid #CED4DA',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.25s ease'
    },
    submitButton: {
        padding: '12px',
        backgroundColor: '#28A745',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 2px 6px rgba(40, 167, 69, 0.25)',
        transition: 'all 0.25s ease'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px'
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        borderRadius: '12px',
        border: '2px solid #DCE8F5',
        boxShadow: '0 2px 12px rgba(13, 110, 253, 0.06)',
        padding: '24px',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
    },
    cardContent: {
        marginBottom: '15px'
    },
    word: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#0D6EFD',
        margin: '0 0 8px 0'
    },
    definition: {
        color: '#212529',
        fontSize: '15px',
        lineHeight: '1.5',
        margin: 0
    },
    example: {
        color: '#6C757D',
        fontSize: '14px',
        fontStyle: 'italic',
        marginTop: '8px'
    },
    cardMeta: {
        marginTop: '12px',
        fontSize: '12px',
        color: '#6C757D'
    },
    nextReview: {
        backgroundColor: '#E7F1FF',
        color: '#0D6EFD',
        padding: '4px 10px',
        borderRadius: '20px',
        fontWeight: '500'
    },
    cardActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        borderTop: '1px solid #DCE8F5',
        paddingTop: '12px'
    },
    editButton: {
        padding: '6px 12px',
        backgroundColor: '#FFC107',
        color: '#333',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.25s ease'
    },
    deleteButton: {
        padding: '6px 12px',
        backgroundColor: '#DC3545',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.25s ease'
    },
    error: {
        backgroundColor: '#F8D7DA',
        color: '#721C24',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '14px'
    },
    emptyState: {
        textAlign: 'center',
        padding: '48px',
        color: '#6C757D',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        borderRadius: '12px',
        border: '2px dashed #DCE8F5'
    }
};

export default FlashcardPage;