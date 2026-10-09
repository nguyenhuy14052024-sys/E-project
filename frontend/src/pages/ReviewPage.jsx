import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getDueFlashcards, getAllFlashcardsForReview, reviewFlashcard } from '../services/flashcardService';

const ReviewPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode') || 'due'; // 'due' hoặc 'all'

    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showAnswer, setShowAnswer] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchFlashcards();
    }, [mode]);

    const fetchFlashcards = async () => {
        setLoading(true);
        setError('');
        try {
            const data = mode === 'all' 
                ? await getAllFlashcardsForReview()
                : await getDueFlashcards();
            setFlashcards(data.flashcards || []);
            setCurrentIndex(0);
            setShowAnswer(false);
            setCompleted(false);
        } catch (err) {
            setError('Lỗi tải flashcard');
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (quality) => {
        const card = flashcards[currentIndex];
        try {
            await reviewFlashcard(card.id, quality);
            
            if (currentIndex + 1 >= flashcards.length) {
                setCompleted(true);
            } else {
                setCurrentIndex(currentIndex + 1);
                setShowAnswer(false);
            }
        } catch (err) {
            setError('Lỗi ôn tập flashcard');
        }
    };

    if (loading) return <div style={styles.page}><div style={styles.container}>Đang tải...</div></div>;

    if (error) return <div style={styles.page}><div style={styles.container} style={{ color: 'red' }}>{error}</div></div>;

    if (completed || flashcards.length === 0) {
        return (
            <div style={styles.page}>
                <div style={styles.bgShape1}></div>
                <div style={styles.bgShape2}></div>
                <div style={styles.container}>
                    <div style={styles.completedBox}>
                        <h1 style={styles.completedTitle}>Hoàn thành!</h1>
                        <p style={styles.completedText}>
                            {flashcards.length === 0 
                                ? 'Không có flashcard nào để ôn tập.' 
                                : `Bạn đã ôn tập xong ${flashcards.length} flashcard.`}
                        </p>
                        <div style={styles.buttonGroup}>
                            <button onClick={() => navigate('/flashcards')} style={styles.button}>
                                Quay lại Flashcard
                            </button>
                            <button 
                                onClick={() => navigate('/review?mode=all')} 
                                style={{ ...styles.button, ...styles.buttonSecondary }}
                            >
                                Ôn lại tất cả
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentCard = flashcards[currentIndex];

    return (
        <div style={styles.page}>
            <div style={styles.bgShape1}></div>
            <div style={styles.bgShape2}></div>

            <div style={styles.container}>
                <div style={styles.progress}>
                    {currentIndex + 1} / {flashcards.length}
                    {mode === 'all' && <span style={styles.modeBadge}>Ôn tất cả</span>}
                </div>
                <div style={styles.card}>
                    <div style={styles.word}>{currentCard.word}</div>
                    {showAnswer ? (
                        <div style={styles.answerBox}>
                            <p style={styles.definition}>{currentCard.definition}</p>
                            {currentCard.example && <p style={styles.example}>📝 {currentCard.example}</p>}
                            <div style={styles.ratingButtons}>
                                <button onClick={() => handleReview(0)} style={{ ...styles.ratingBtn, ...styles.againBtn }}>Again</button>
                                <button onClick={() => handleReview(1)} style={{ ...styles.ratingBtn, ...styles.hardBtn }}>Hard</button>
                                <button onClick={() => handleReview(2)} style={{ ...styles.ratingBtn, ...styles.goodBtn }}>Good</button>
                                <button onClick={() => handleReview(3)} style={{ ...styles.ratingBtn, ...styles.easyBtn }}>Easy</button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setShowAnswer(true)} style={styles.showAnswerBtn}>
                            Xem đáp án
                        </button>
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
        padding: '40px',
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
    },
    progress: {
        fontSize: '14px',
        color: '#6C757D',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px'
    },
    modeBadge: {
        backgroundColor: '#E7F1FF',
        color: '#0D6EFD',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600'
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        padding: '48px 40px',
        borderRadius: '16px',
        border: '2px solid #DCE8F5',
        boxShadow: '0 4px 24px rgba(13, 110, 253, 0.10)',
        minHeight: '320px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    word: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#0D6EFD',
        marginBottom: '24px'
    },
    answerBox: {
        marginTop: '20px'
    },
    definition: {
        fontSize: '18px',
        color: '#212529',
        lineHeight: '1.6'
    },
    example: {
        fontSize: '16px',
        color: '#6C757D',
        fontStyle: 'italic',
        marginTop: '12px'
    },
    showAnswerBtn: {
        padding: '14px 36px',
        backgroundColor: '#0D6EFD',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        boxShadow: '0 4px 12px rgba(13, 110, 253, 0.35)',
        transition: 'all 0.25s ease',
        alignSelf: 'center'
    },
    ratingButtons: {
        display: 'flex',
        gap: '12px',
        marginTop: '28px',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    ratingBtn: {
        padding: '12px 28px',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        color: 'white',
        transition: 'all 0.25s ease',
        minWidth: '80px'
    },
    againBtn: { backgroundColor: '#DC3545', boxShadow: '0 2px 6px rgba(220, 53, 69, 0.25)' },
    hardBtn: { backgroundColor: '#FD7E14', boxShadow: '0 2px 6px rgba(253, 126, 20, 0.25)' },
    goodBtn: { backgroundColor: '#28A745', boxShadow: '0 2px 6px rgba(40, 167, 69, 0.25)' },
    easyBtn: { backgroundColor: '#0D6EFD', boxShadow: '0 2px 6px rgba(13, 110, 253, 0.25)' },
    completedBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        padding: '48px 40px',
        borderRadius: '16px',
        border: '2px solid #DCE8F5',
        boxShadow: '0 4px 24px rgba(13, 110, 253, 0.10)'
    },
    completedTitle: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#212529',
        marginBottom: '12px'
    },
    completedText: {
        fontSize: '16px',
        color: '#6C757D',
        marginBottom: '24px'
    },
    buttonGroup: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    button: {
        padding: '12px 24px',
        backgroundColor: '#0D6EFD',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 2px 6px rgba(13, 110, 253, 0.25)',
        transition: 'all 0.25s ease'
    },
    buttonSecondary: {
        backgroundColor: '#28A745',
        boxShadow: '0 2px 6px rgba(40, 167, 69, 0.25)'
    }
};

export default ReviewPage;