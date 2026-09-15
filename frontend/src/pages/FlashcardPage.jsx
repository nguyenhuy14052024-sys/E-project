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
        <div style={styles.container}>
            <div style={styles.header}>
                <h1> Flashcard</h1>
                <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ word: '', definition: '', example: '', unitId: '' }); }} style={styles.addButton}>
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
                        <div key={card.id} style={styles.card}>
                            <div style={styles.cardContent}>
                                <h3>{card.word}</h3>
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
    );
};

const styles = {
    container: {
        padding: '40px',
        maxWidth: '1000px',
        margin: '0 auto'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    addButton: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px'
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
    submitButton: {
        padding: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '20px',
        transition: 'transform 0.2s'
    },
    cardContent: {
        marginBottom: '15px'
    },
    definition: {
        color: '#333',
        fontSize: '15px'
    },
    example: {
        color: '#666',
        fontSize: '14px',
        fontStyle: 'italic',
        marginTop: '8px'
    },
    cardMeta: {
        marginTop: '10px',
        fontSize: '12px',
        color: '#888'
    },
    nextReview: {
        backgroundColor: '#e9ecef',
        padding: '3px 8px',
        borderRadius: '3px'
    },
    cardActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        borderTop: '1px solid #eee',
        paddingTop: '10px'
    },
    editButton: {
        padding: '5px 10px',
        backgroundColor: '#ffc107',
        color: '#333',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer'
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

export default FlashcardPage;