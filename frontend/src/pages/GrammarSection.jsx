import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getUnitById, getQuestions } from '../services/unitService';
import DictionaryPopup from '../components/DictionaryPopup';

const GrammarSection = () => {
    const { unitId } = useParams();
    const [searchParams] = useSearchParams();
    const filterType = searchParams.get('type') || '';
    const navigate = useNavigate();
    
    const [unit, setUnit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [selectedWord, setSelectedWord] = useState(null);

    useEffect(() => {
        fetchUnit();
    }, [unitId, filterType]);

    const fetchUnit = async () => {
        setLoading(true);
        try {
            const data = await getUnitById(unitId);
            setUnit(data.unit);
            setTotalQuestions(data.questionCount || 0);
        } catch (err) {
            setError('Không thể tải nội dung');
        } finally {
            setLoading(false);
        }
    };

    const getLevelTheme = (level) => {
        const themes = {
            A1: { primary: '#28A745', bg: '#F0F9F2', accent: '#D4EDDA' },
            A2: { primary: '#17A2B8', bg: '#F0F8FA', accent: '#D1ECF1' },
            B1: { primary: '#6F42C1', bg: '#F5F0FA', accent: '#E2D9F3' },
            B2: { primary: '#FD7E14', bg: '#FFF8F0', accent: '#FFE8CC' },
            C1: { primary: '#DC3545', bg: '#FDF0F2', accent: '#F8D7DA' }
        };
        return themes[level] || themes.B2;
    };

    const getDifficultyOpacity = (difficulty) => {
        return difficulty === 1 ? '08' : difficulty === 2 ? '14' : '22';
    };

    const getDifficultyLabel = (difficulty) => {
        return difficulty === 1 ? 'Cơ bản' : difficulty === 2 ? 'Trung bình' : 'Nâng cao';
    };

    const handleWordClick = (e) => {
        if (e.target.tagName === 'SPAN' && e.target.dataset.word) {
            setSelectedWord(e.target.dataset.word);
        }
    };
const highlightWords = (text) => {
    if (!text) return '';
    
    const stringText = String(text);
    
    // Kiểm tra có phải HTML không (có thẻ đóng mở)
    const isHTML = /<[a-z][\s\S]*>/i.test(stringText);
    
    if (isHTML) {
        // Là HTML → giữ nguyên, KHÔNG escape
        // Chỉ highlight từ nếu muốn (có thể bỏ qua để tránh phá HTML)
        return stringText;
    }
    
    // Là plain text → escape và highlight
    let formatted = stringText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
    
    return formatted.replace(
        /\b([a-zA-Z]{3,})\b/g,
        '<span data-word="$1" style="cursor:pointer;border-bottom:1px dotted #007bff">$1</span>'
    );
};

    if (loading) return <div style={styles.loadingContainer}>Đang tải...</div>;
    if (error) return <div style={styles.loadingContainer}>{error}</div>;
    if (!unit) return <div style={styles.loadingContainer}>Không tìm thấy Unit</div>;

    const theme = getLevelTheme(unit.book_level);
    const bgColor = `${theme.bg}${getDifficultyOpacity(unit.difficulty || 1)}`;

    return (
        <div style={{ ...styles.page, backgroundColor: bgColor }}>
            <div style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                    <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
                        ← Về Dashboard
                    </button>
                    <div style={styles.headerRight}>
                        <span style={styles.levelBadge}>{unit.book_level}</span>
                        <span style={styles.difficultyBadge}>
                            {getDifficultyLabel(unit.difficulty || 1)}
                        </span>
                    </div>
                </div>

                {/* Book */}
                <div style={styles.book}>
                    {/* Book header */}
                    <div style={styles.bookHeader}>
                        <div style={styles.bookChapter}>Unit {unit.unit_number}</div>
                        <h1 style={{ ...styles.bookTitle, color: theme.primary }}>{unit.title}</h1>
                        {unit.description && (
                            <p style={styles.bookDescription}>{unit.description}</p>
                        )}
                        <div style={{ ...styles.bookDivider, backgroundColor: theme.primary }} />
                    </div>

                    {/* Filter info */}
                    {filterType && (
                        <div style={{ ...styles.filterInfo, color: theme.primary, backgroundColor: theme.accent }}>
                            Đang lọc: <strong>{filterType.replace('_', ' ').toUpperCase()}</strong> ({totalQuestions} câu hỏi)
                        </div>
                    )}

                    {/* Note */}
                   {unit.note && (
    <div style={styles.noteWrapper}>
        <div style={{ ...styles.noteLine, backgroundColor: theme.primary }} />
        <div style={styles.noteContent}>
            <p style={styles.noteText}>{unit.note}</p>
        </div>
    </div>
)}

                    {/* Parts */}
                    {unit.parts && Array.isArray(unit.parts) && unit.parts.length > 0 ? (
                        unit.parts
                            .filter(part => part && !Array.isArray(part) && part.title && part.content)
                            .map((part, index) => (
                                <div key={index} style={styles.part}>
                                    <div style={styles.partHeader}>
                                        <span style={{ ...styles.partNumber, backgroundColor: theme.primary }}>
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <h3 style={{ ...styles.partTitle, color: theme.primary }}>
                                            {part.title}
                                        </h3>
                                    </div>
                                    <div 
                                        style={styles.partContent}
                                        onClick={handleWordClick}
                                        dangerouslySetInnerHTML={{ 
                                            __html: highlightWords(part.content)
                                        }}
                                    />
                                    {index < unit.parts.length - 1 && (
                                        <div style={styles.partDivider} />
                                    )}
                                </div>
                            ))
                    ) : (
                        <div 
                            style={styles.partContent}
                            onClick={handleWordClick}
                            dangerouslySetInnerHTML={{ 
                                __html: highlightWords(unit.content_html || '<p>Chưa có nội dung lý thuyết</p>')
                            }}
                        />
                    )}

                    {/* CTA */}
                    <div style={styles.ctaWrapper}>
                        <button 
                            onClick={() => navigate(`/practice/${unitId}?type=${filterType}`)} 
                            style={{ ...styles.button, backgroundColor: theme.primary }}
                        >
                            Bắt đầu làm bài tập
                        </button>
                    </div>
                </div>

                {selectedWord && (
                    <DictionaryPopup 
                        word={selectedWord} 
                        onClose={() => setSelectedWord(null)} 
                    />
                )}
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        fontFamily: "'Inter', 'Roboto', sans-serif",
        padding: '32px 24px'
    },
    container: {
        maxWidth: '820px',
        margin: '0 auto'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
    },
    headerRight: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center'
    },
    backButton: {
        padding: '8px 16px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        color: '#495057',
        border: '1px solid #DCE8F5',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s ease'
    },
    levelBadge: {
        padding: '6px 14px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '700',
        color: '#495057',
        border: '1px solid #DCE8F5',
        letterSpacing: '0.5px'
    },
    difficultyBadge: {
        padding: '6px 14px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        color: '#6C757D',
        border: '1px solid #DCE8F5'
    },
    book: {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '56px 64px',
        borderRadius: '16px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
        lineHeight: '1.9',
        position: 'relative'
    },
    bookHeader: {
        marginBottom: '40px',
        textAlign: 'center'
    },
    bookChapter: {
        fontSize: '12px',
        fontWeight: '700',
        color: '#6C757D',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        marginBottom: '12px'
    },
    bookTitle: {
        fontSize: '36px',
        fontWeight: '800',
        marginBottom: '12px',
        lineHeight: '1.2'
    },
    bookDescription: {
        fontSize: '16px',
        color: '#6C757D',
        fontStyle: 'italic',
        marginBottom: '24px',
        lineHeight: '1.6'
    },
    bookDivider: {
        width: '60px',
        height: '3px',
        margin: '0 auto',
        borderRadius: '2px'
    },
    filterInfo: {
        padding: '12px 20px',
        borderRadius: '8px',
        marginBottom: '32px',
        fontSize: '14px',
        fontWeight: '500',
        textAlign: 'center'
    },
   noteWrapper: {
    display: 'flex',
    gap: '16px',
    marginBottom: '40px',
    paddingLeft: '8px'
},
noteLine: {
    width: '3px',
    borderRadius: '2px',
    flexShrink: 0,
    opacity: 0.6
},
noteContent: {
    flex: 1,
    paddingTop: '2px'
},
noteText: {
    fontSize: '15px',
    color: '#6C757D',
    fontStyle: 'italic',
    fontFamily: "'Georgia', 'Times New Roman', serif",
    lineHeight: '1.8',
    margin: 0,
    letterSpacing: '0.2px'
},
    part: {
        marginBottom: '40px'
    },
    partHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '20px'
    },
    partNumber: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        color: '#FFFFFF',
        fontSize: '14px',
        fontWeight: '700',
        letterSpacing: '0.5px',
        flexShrink: 0
    },
    partTitle: {
        fontSize: '22px',
        fontWeight: '700',
        margin: 0,
        lineHeight: '1.3'
    },
    partContent: {
        fontSize: '16px',
        color: '#343A40',
        lineHeight: '1.9',
        paddingLeft: '56px'
    },
    partDivider: {
        height: '1px',
        backgroundColor: '#E9ECEF',
        marginTop: '40px',
        marginLeft: '56px'
    },
    ctaWrapper: {
        marginTop: '56px',
        paddingTop: '32px',
        borderTop: '1px solid #E9ECEF'
    },
    button: {
        padding: '16px 32px',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        width: '100%',
        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        transition: 'all 0.25s ease',
        letterSpacing: '0.3px'
    },
    loadingContainer: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        color: '#6C757D',
        fontFamily: "'Inter', 'Roboto', sans-serif"
    }
};

export default GrammarSection;