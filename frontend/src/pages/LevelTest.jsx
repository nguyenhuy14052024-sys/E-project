import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTestForUser, submitTest } from '../services/levelTestService';

const LevelTest = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);
    const [timeSpent, setTimeSpent] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => { fetchTest(); }, [testId]);

    useEffect(() => {
        if (test && !submitted) {
            const duration = test.duration * 60;
            setTimeLeft(duration);
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleAutoSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
                setTimeSpent(prev => prev + 1);
            }, 1000);
            return () => clearInterval(timerRef.current);
        }
    }, [test, submitted]);

    const fetchTest = async () => {
        setLoading(true);
        try {
            const data = await getTestForUser(testId);
            setTest(data.test);
        } catch (err) {
            setError('Không thể tải bài test');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId, value) => {
        if (submitted) return;
        setAnswers({ ...answers, [questionId]: value });
    };

    const handleAutoSubmit = () => { if (!submitted) handleSubmit(); };

    const handleSubmit = async () => {
        if (submitted) return;
        clearInterval(timerRef.current);

        const answerList = Object.entries(answers).map(([questionId, userAnswer]) => ({
            questionId, userAnswer
        }));

        if (answerList.length === 0) {
            const confirmed = window.confirm('Bạn chưa chọn đáp án nào. Vẫn nộp bài? (Bài sẽ được tính 0 điểm)');
            if (!confirmed) return;
        }

        try {
            const data = await submitTest(testId, answerList, timeSpent);
            setResult(data);
            setSubmitted(true);
            window.scrollTo(0, 0);
        } catch (err) {
            setError('Lỗi nộp bài');
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const isMultipleChoiceGroup = (group) => {
        return ['reading_comprehension', 'cloze_test', 'sentence_completion', 'synonym_antonym', 'communication', 'error_identification', 'pronunciation', 'word_stress'].includes(group);
    };

    if (loading) return <div style={styles.page}><div style={styles.container}><div style={styles.spinner}></div></div></div>;
    if (error) return <div style={styles.page}><div style={styles.container}><p style={{ textAlign: 'center', color: 'red' }}>{error}</p></div></div>;
    if (!test) return null;

    const passageMap = {};
    (test.passages || []).forEach(p => { passageMap[p.id] = p; });
    const sortedQuestions = [...test.questions].sort((a, b) => (a.order || 0) - (b.order || 0));
    
    const groupedSections = {};
    sortedQuestions.forEach(q => {
        const secName = q.section || 'SECTION A';
        if (!groupedSections[secName]) groupedSections[secName] = [];
        groupedSections[secName].push(q);
    });
    const sortedSectionNames = Object.keys(groupedSections).sort();
    const renderedPassages = new Set();
    let globalQuestionNumber = 1;

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <div style={styles.headerContent}>
                    <div>
                        <h1 style={styles.testTitle}>ENGLISH TEST - LEVEL {test.book_level}</h1>
                        <p style={styles.testInfo}>{test.title} | Total score: {test.total_score} points</p>
                    </div>
                    <div style={styles.timer}>
                        <span style={styles.timerLabel}>Time left</span>
                        <span style={{ ...styles.timerValue, color: timeLeft < 60 ? '#DC3545' : '#0D6EFD' }}>{formatTime(timeLeft)}</span>
                    </div>
                </div>
            </div>

            <div style={styles.container}>
                {submitted && result && (
                    <div style={styles.resultBanner}>
                        <h2 style={styles.resultTitle}>TEST RESULT</h2>
                        <p style={styles.resultScore}>Score: <strong>{result.score}%</strong></p>
                        <p style={styles.resultDetail}>Correct: {result.correctCount} / {result.totalQuestions}</p>
                        <p style={styles.resultDetail}>Points: {result.totalScore} / {result.maxScore}</p>
                        <div style={styles.resultButtons}><button onClick={() => navigate('/dashboard')} style={styles.btnPrimary}>Back to Dashboard</button></div>
                    </div>
                )}

                {sortedSectionNames.map((secName) => (
                    <div key={secName} style={styles.section}>
                        <div style={styles.sectionHeaderBox}>
                            <h2 style={styles.sectionTitle}>{secName}</h2>
                        </div>

                        {groupedSections[secName].map((q, idx) => {
                            const answerResult = submitted && result ? result.results?.find(r => r.questionId === q.id) : null;
                            const questionNumber = globalQuestionNumber++;
                            let passageBlock = null;

                            if (q.passage_id && !renderedPassages.has(q.passage_id)) {
                                const passage = passageMap[q.passage_id];
                                if (passage) {
                                    renderedPassages.add(q.passage_id);
                                    passageBlock = (
                                        <div style={styles.passageBox}>
                                            {passage.title && <h3 style={styles.passageTitle}>{passage.title}</h3>}
                                            {passage.image_url && <img src={passage.image_url} alt="Passage" style={{ ...styles.passageImage, width: passage.image_width || '100%' }} />}
                                            <div style={styles.passageContent} dangerouslySetInnerHTML={{ __html: passage.content }} />
                                            {passage.source && <p style={styles.passageSource}>Source: {passage.source}</p>}
                                        </div>
                                    );
                                }
                            }

                            return (
                                <div key={q.id} style={styles.questionBlock}>
                                    {passageBlock}
                                    <div style={styles.questionText}>
                                        <strong>Question {questionNumber}:</strong>
                                        <span dangerouslySetInnerHTML={{ __html: ' ' + q.content }} />
                                    </div>

                                    {isMultipleChoiceGroup(q.question_group) && q.options && q.options.length > 0 && (
                                        <div style={styles.optionsList}>
                                            {q.options.map((opt, i) => {
                                                const isSelected = answers[q.id] === opt;
                                                const isCorrect = submitted && answerResult && answerResult.correctAnswer === opt;
                                                const isWrong = submitted && isSelected && !isCorrect;
                                                return (
                                                    <label key={i} style={{ ...styles.optionItem, ...(isCorrect ? styles.optionCorrect : {}), ...(isWrong ? styles.optionWrong : {}), ...(submitted ? styles.optionDisabled : {}) }}>
                                                        <input type="radio" name={`q-${q.id}`} value={opt} checked={isSelected || false} onChange={(e) => handleAnswerChange(q.id, e.target.value)} disabled={submitted} style={styles.radioInput} />
                                                        
                                                        {/* HIỂN THỊ ĐỊNH DẠNG VĂN BẢN (GẠCH CHÂN) */}
                                                        <span style={styles.optionLabel}>
                                                            {String.fromCharCode(65 + i)}. <span dangerouslySetInnerHTML={{ __html: opt }} />
                                                        </span>

                                                        {isCorrect && <span style={styles.checkMark}>✓</span>}
                                                        {isWrong && <span style={styles.crossMark}>✗</span>}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {q.question_group === 'true_false' && (!q.options || q.options.length === 0) && (
                                        <div style={styles.optionsList}>
                                            {['True', 'False', 'Not Given'].map((opt) => {
                                                const isSelected = answers[q.id] === opt;
                                                const isCorrect = submitted && answerResult && answerResult.correctAnswer === opt;
                                                const isWrong = submitted && isSelected && !isCorrect;
                                                return (
                                                    <label key={opt} style={{ ...styles.optionItem, ...(isCorrect ? styles.optionCorrect : {}), ...(isWrong ? styles.optionWrong : {}), ...(submitted ? styles.optionDisabled : {}) }}>
                                                        <input type="radio" name={`q-${q.id}`} value={opt} checked={isSelected || false} onChange={(e) => handleAnswerChange(q.id, e.target.value)} disabled={submitted} style={styles.radioInput} />
                                                        <span style={styles.optionLabel}>{opt}</span>
                                                        {isCorrect && <span style={styles.checkMark}>✓</span>}
                                                        {isWrong && <span style={styles.crossMark}>✗</span>}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {(!q.options || q.options.length === 0) && q.question_group !== 'true_false' && !isMultipleChoiceGroup(q.question_group) && (
                                        <div style={styles.fillInBlankWrapper}>
                                            {q.prefix && <span style={styles.prefixText}>{q.prefix}</span>}
                                            <input type="text" value={answers[q.id] || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)} placeholder="Nhập câu trả lời..." disabled={submitted} style={{ ...styles.fillInBlankInput, backgroundColor: submitted && answerResult ? (answerResult.isCorrect ? '#D4EDDA' : '#F8D7DA') : '#FFF' }} />
                                            {q.suffix && <span style={styles.suffixText}>{q.suffix}</span>}
                                        </div>
                                    )}

                                    {submitted && answerResult && (
                                        <div style={styles.explanation}>
                                            <p style={styles.explanationTitle}>Answer: {answerResult.correctAnswer}</p>
                                            {answerResult.explanation && <p style={styles.explanationText}>{answerResult.explanation}</p>}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}

                <div style={styles.theEnd}>--- The End ---</div>
                {!submitted && <button onClick={handleSubmit} style={styles.submitButton}>SUBMIT TEST</button>}
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', backgroundColor: '#FFFFFF', fontFamily: "'Times New Roman', 'Georgia', serif", width: '100%', maxWidth: '100vw', boxSizing: 'border-box' },
    header: { backgroundColor: '#FFFFFF', borderBottom: '2px solid #000', position: 'sticky', top: 0, zIndex: 100, padding: '16px 0' },
    headerContent: { maxWidth: '900px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' },
    testTitle: { fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: '700', color: '#000', margin: '0 0 4px 0', letterSpacing: '0.5px' },
    testInfo: { fontSize: '13px', color: '#333', margin: 0 },
    timer: { textAlign: 'right' },
    timerLabel: { display: 'block', fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' },
    timerValue: { fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: '700', fontFamily: 'monospace' },
    container: { maxWidth: '900px', margin: '0 auto', padding: '32px 24px', boxSizing: 'border-box' },
    section: { marginBottom: '60px' },
    sectionHeaderBox: { borderBottom: '2px solid #000', paddingBottom: '8px', marginBottom: '24px', display: 'flex', alignItems: 'baseline', gap: '12px' },
    sectionTitle: { fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: '700', color: '#000', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 },
    passageBox: { backgroundColor: '#F8F9FA', border: '1px solid #DEE2E6', borderLeft: '4px solid #0D6EFD', borderRadius: '6px', padding: '16px 20px', marginBottom: '24px' },
    passageTitle: { fontSize: '18px', fontWeight: '700', color: '#000', margin: '0 0 12px 0', textAlign: 'center', fontStyle: 'italic' },
    passageImage: { display: 'block', margin: '0 auto 16px', maxWidth: '100%', height: 'auto', borderRadius: '4px' },
    passageContent: { fontSize: '15px', color: '#212529', lineHeight: '1.8', margin: 0 },
    passageSource: { fontSize: '12px', color: '#6C757D', fontStyle: 'italic', marginTop: '12px', marginBottom: 0, textAlign: 'right' },
    questionBlock: { marginBottom: '28px', paddingLeft: '8px' },
    questionText: { fontSize: '16px', color: '#000', lineHeight: '1.7', margin: '0 0 12px 0' },
    optionsList: { display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '24px' },
    optionItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '15px', color: '#000', transition: 'background-color 0.2s', userSelect: 'none' },
    optionCorrect: { backgroundColor: '#D4EDDA', borderLeft: '4px solid #28A745' },
    optionWrong: { backgroundColor: '#F8D7DA', borderLeft: '4px solid #DC3545' },
    optionDisabled: { cursor: 'default' },
    radioInput: { cursor: 'pointer', width: '18px', height: '18px' },
    optionLabel: { flex: 1 },
    checkMark: { color: '#28A745', fontWeight: '700', fontSize: '18px' },
    crossMark: { color: '#DC3545', fontWeight: '700', fontSize: '18px' },
    fillInBlankWrapper: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginLeft: '24px', marginTop: '8px' },
    prefixText: { fontSize: '16px', fontWeight: '500', color: '#000' },
    suffixText: { fontSize: '16px', fontWeight: '500', color: '#000' },
    fillInBlankInput: { flex: 1, minWidth: '200px', padding: '10px 14px', border: '1px solid #333', borderBottom: '2px solid #000', borderRadius: '4px', fontSize: '16px', outline: 'none', fontFamily: 'inherit' },
    explanation: { marginTop: '12px', padding: '12px 16px', backgroundColor: '#F8F9FA', borderLeft: '3px solid #0D6EFD', fontSize: '14px', marginLeft: '24px' },
    explanationTitle: { margin: '0 0 4px 0', fontWeight: '700', color: '#0D6EFD' },
    explanationText: { margin: 0, color: '#495057', lineHeight: '1.6' },
    theEnd: { textAlign: 'center', fontSize: '16px', fontWeight: '700', color: '#000', letterSpacing: '2px', margin: '40px 0', paddingTop: '20px', borderTop: '1px solid #CCC' },
    submitButton: { display: 'block', margin: '0 auto', padding: '16px 48px', backgroundColor: '#0D6EFD', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', letterSpacing: '1px', maxWidth: '100%', boxSizing: 'border-box' },
    resultBanner: { backgroundColor: '#F0F8FF', border: '2px solid #0D6EFD', borderRadius: '12px', padding: '24px', marginBottom: '32px', textAlign: 'center' },
    resultTitle: { fontSize: '22px', fontWeight: '700', color: '#0D6EFD', margin: '0 0 12px 0', letterSpacing: '2px' },
    resultScore: { fontSize: '28px', margin: '8px 0', color: '#000' },
    resultDetail: { fontSize: '15px', color: '#495057', margin: '4px 0' },
    resultButtons: { marginTop: '16px' },
    btnPrimary: { padding: '10px 24px', backgroundColor: '#0D6EFD', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }
};

export default LevelTest;