import React, { useState, useEffect } from 'react';
import { lookupWord } from '../services/dictionaryService';

const DictionaryPopup = ({ word, onClose }) => {
    const [entry, setEntry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchWord = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await lookupWord(word);
                setEntry(data.entry);
            } catch (err) {
                setError(err.message || 'Không tìm thấy từ này');
            } finally {
                setLoading(false);
            }
        };
        if (word) fetchWord();
    }, [word]);

    if (!word) return null;

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} style={styles.closeBtn}>✕</button>

                {loading && <div style={styles.loading}>Đang tra từ...</div>}

                {error && <div style={styles.error}>{error}</div>}

                {entry && !loading && (
                    <div>
                        <h2 style={styles.word}>{entry.word}</h2>

                        {entry.pronunciation && (
                            <p style={styles.pronunciation}>/{entry.pronunciation}/</p>
                        )}

                        {entry.audio_url && (
                            <audio controls src={entry.audio_url} style={styles.audio}>
                                Trình duyệt không hỗ trợ audio.
                            </audio>
                        )}

                        {entry.word_type && entry.word_type !== 'unknown' && (
                            <p style={styles.wordType}>
                                <em>{entry.word_type}</em>
                            </p>
                        )}

                        {entry.definition_en && (
                            <div style={styles.section}>
                                <strong>Định nghĩa (EN):</strong>
                                <p>{entry.definition_en}</p>
                            </div>
                        )}

                        {entry.definition_vi && (
                            <div style={styles.section}>
                                <strong>Nghĩa (VI):</strong>
                                <p>{entry.definition_vi}</p>
                            </div>
                        )}

                        {entry.example && (
                            <div style={styles.section}>
                                <strong>Ví dụ:</strong>
                                <p style={styles.example}>"{entry.example}"</p>
                            </div>
                        )}

                        <p style={styles.source}>Nguồn: {entry.source}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
    },
    popup: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        position: 'relative'
    },
    closeBtn: {
        position: 'absolute',
        top: '10px',
        right: '15px',
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#666'
    },
    loading: {
        textAlign: 'center',
        color: '#666',
        padding: '20px'
    },
    error: {
        color: '#dc3545',
        textAlign: 'center',
        padding: '20px'
    },
    word: {
        fontSize: '28px',
        marginBottom: '5px',
        color: '#333'
    },
    pronunciation: {
        color: '#666',
        fontSize: '16px',
        marginBottom: '10px'
    },
    audio: {
        width: '100%',
        marginBottom: '15px'
    },
    wordType: {
        color: '#007bff',
        marginBottom: '15px'
    },
    section: {
        marginBottom: '15px',
        lineHeight: '1.6'
    },
    example: {
        fontStyle: 'italic',
        color: '#555'
    },
    source: {
        fontSize: '12px',
        color: '#999',
        marginTop: '15px',
        textAlign: 'right'
    }
};

export default DictionaryPopup;