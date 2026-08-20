import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDueFlashcards, reviewFlashcard } from '../services/flashcardService';

const ReviewPage = () => {
    const navigate = useNavigate();
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showAnswer, setShowAnswer] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDueFlashcards();
    }, []);

    const fetchDueFlashcards = async () => {
        setLoading(true);
        try {
            const data = await getDueFlashcards();
            setFlashcards(data.flashcards || []);
        } catch (err) {
            setError('Lỗi tải flashcard đến hạn');
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

    if (loading) return <div style={styles.container}>Đang tải...</div>;

    if (error) return <div style={styles.container} style={{ color: 'red' }}>{error}</div>;

    if (completed || flashcards.length === 0) {
        return (
            <div style={styles.container}>
                <div style={styles.completedBox}>
                    <h1>🎉 Hoàn thành!</h1>
                    <p>Bạn đã ôn tập xong {flashcards.length} flashcard.</p>
                    <button onClick={() => navigate('/flashcards')} style={styles.button}>
                        Quay lại Flashcard
                    </button>
                </div>
            </div>
        );
    }

    const currentCard = flashcards[currentIndex];

    return (
        <div style={styles.container}>
            <div style={styles.progress}>
                {currentIndex + 1} / {flashcards.length}
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
    );
};

const styles = {
    container: {
        padding: '40px',
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center'
    },
    progress: {
        fontSize: '14px',
        color: '#666',
        marginBottom: '20px'
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    word: {
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '20px'
    },
    answerBox: {
        marginTop: '20px'
    },
    definition: {
        fontSize: '18px',
        color: '#333'
    },
    example: {
        fontSize: '16px',
        color: '#666',
        fontStyle: 'italic',
        marginTop: '10px'
    },
    showAnswerBtn: {
        padding: '12px 30px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px'
    },
    ratingButtons: {
        display: 'flex',
        gap: '10px',
        marginTop: '20px',
        justifyContent: 'center'
    },
    ratingBtn: {
        padding: '10px 25px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        color: 'white'
    },
    againBtn: { backgroundColor: '#dc3545' },
    hardBtn: { backgroundColor: '#fd7e14' },
    goodBtn: { backgroundColor: '#28a745' },
    easyBtn: { backgroundColor: '#007bff' },
    completedBox: {
        backgroundColor: '#d4edda',
        padding: '40px',
        borderRadius: '10px'
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '15px'
    }
};

export default ReviewPage;