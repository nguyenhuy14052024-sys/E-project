import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    getLevelTestById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    createPassage,
    updatePassage,
    deletePassage
} from '../../services/levelTestService';

const QUESTION_GROUPS = [
    { value: 'pronunciation', label: 'Phát âm (Pronunciation)' },
    { value: 'word_stress', label: 'Trọng âm (Word Stress)' },
    { value: 'sentence_completion', label: 'Hoàn thành câu' },
    { value: 'synonym_antonym', label: 'Đồng nghĩa / Trái nghĩa' },
    { value: 'communication', label: 'Giao tiếp' },
    { value: 'cloze_test', label: 'Cloze Test' },
    { value: 'reading_comprehension', label: 'Reading Comprehension' },
    { value: 'true_false', label: 'True / False' },
    { value: 'error_identification', label: 'Tìm lỗi sai' },
    { value: 'sentence_transformation', label: 'Viết lại câu' },
    { value: 'sentence_combination', label: 'Nối câu' }
];

const isMultipleChoiceGroup = (group) => {
    return ['reading_comprehension', 'cloze_test', 'sentence_completion', 'synonym_antonym', 'communication', 'error_identification', 'pronunciation', 'word_stress'].includes(group);
};

const isFillInBlankGroup = (group) => {
    return ['sentence_transformation', 'sentence_completion', 'sentence_combination'].includes(group);
};

// Component nhỏ để render form sửa tại chỗ cho câu hỏi độc lập
const InlineQuestionForm = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState(initialData);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const isMC = isMultipleChoiceGroup(formData.question_group);
        let filteredOptions = null;
        if (isMC) {
            filteredOptions = formData.options.filter(o => o && o.trim() !== '');
            if (filteredOptions.length < 2) filteredOptions = null;
        }

        try {
            await onSave({
                ...formData,
                options: filteredOptions
            });
        } catch (err) {
            setError(err.message || 'Lỗi lưu câu hỏi');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            {error && <div style={styles.error}>{error}</div>}
            <div style={styles.formRow}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Dạng bài</label>
                    <select
                        value={formData.question_group}
                        onChange={(e) => {
                            const newGroup = e.target.value;
                            const isMC = isMultipleChoiceGroup(newGroup);
                            const defaultAnswer = isMC ? 'A' : (newGroup === 'true_false' ? 'True' : '');
                            setFormData({ ...formData, question_group: newGroup, correct_answer: defaultAnswer });
                        }}
                        style={styles.input}
                    >
                        {QUESTION_GROUPS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Tên Phần (Section)</label>
                    <input type="text" value={formData.section || ''} onChange={(e) => setFormData({ ...formData, section: e.target.value })} style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Điểm</label>
                    <input type="number" value={formData.score} onChange={(e) => setFormData({ ...formData, score: parseFloat(e.target.value) })} style={styles.input} step="0.5" min="0.5" />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Thứ tự</label>
                    <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} style={styles.input} min="1" />
                </div>
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Nội dung câu hỏi *</label>
                <ReactQuill theme="snow" value={formData.content} onChange={(val) => setFormData({ ...formData, content: val })} modules={{ toolbar: [['bold', 'italic', 'underline', 'strike'], [{ color: [] }, { background: [] }], ['clean']] }} style={styles.quill} />
            </div>

            {isFillInBlankGroup(formData.question_group) && (
                <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Tiền tố (Chữ đứng trước)</label>
                        <input type="text" value={formData.prefix || ''} onChange={(e) => setFormData({ ...formData, prefix: e.target.value })} style={styles.input} placeholder="VD: She said" />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Hậu tố (Chữ đứng sau)</label>
                        <input type="text" value={formData.suffix || ''} onChange={(e) => setFormData({ ...formData, suffix: e.target.value })} style={styles.input} placeholder="VD: in the morning." />
                    </div>
                </div>
            )}

            {/* ĐÃ SỬA LỖI: Dùng formData thay vì q, dùng ReactQuill cho Lựa chọn */}
            {isMultipleChoiceGroup(formData.question_group) && (
                <div style={styles.formGroup}>
                    <label style={styles.label}>Các lựa chọn (A/B/C/D) - Có thể gạch chân âm tiết</label>
                    <div style={styles.optionsGrid}>
                        {['A', 'B', 'C', 'D'].map((label, idx) => (
                            <div key={idx} style={{ marginBottom: '10px' }}>
                                <span style={styles.optionLabel}>{label}.</span>
                                <ReactQuill
                                    theme="snow"
                                    value={formData.options[idx] || ''}
                                    onChange={(val) => { const newOpts = [...formData.options]; newOpts[idx] = val; setFormData({ ...formData, options: newOpts }); }}
                                    modules={{ toolbar: [['underline', 'clean']] }}
                                    style={{ backgroundColor: 'white', height: '80px', marginTop: '4px' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={styles.formRow}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Đáp án đúng *</label>
                    {isMultipleChoiceGroup(formData.question_group) ? (
                        <select value={formData.correct_answer} onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })} style={styles.input}>
                            <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                        </select>
                    ) : formData.question_group === 'true_false' ? (
                        <select value={formData.correct_answer} onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })} style={styles.input}>
                            <option value="True">True</option><option value="False">False</option><option value="Not Given">Not Given</option>
                        </select>
                    ) : (
                        <input type="text" value={formData.correct_answer} onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })} style={styles.input} />
                    )}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Giải thích đáp án</label>
                    <textarea value={formData.explanation} onChange={(e) => setFormData({ ...formData, explanation: e.target.value })} style={styles.textarea} rows="2" />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={styles.submitButton}>Lưu thay đổi</button>
                <button type="button" onClick={onCancel} style={styles.backButton}>Hủy</button>
            </div>
        </form>
    );
};

const ManageLevelTestQuestions = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [passages, setPassages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State quản lý việc sửa tại chỗ
    const [editingQuestionId, setEditingQuestionId] = useState(null);

    // Form câu hỏi mới (thêm mới)
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [questionData, setQuestionData] = useState({
        question_group: 'pronunciation', section: 'SECTION A', content: '', prefix: '', suffix: '', options: ['', '', '', ''], correct_answer: 'A', explanation: '', score: 1, order: 0, passage_id: ''
    });

    // Form bài đọc
    const [showPassageForm, setShowPassageForm] = useState(false);
    const [editingPassageId, setEditingPassageId] = useState(null);
    const [passageData, setPassageData] = useState({ title: '', content: '', image_url: '', image_width: '100%', source: '', questions: [] });

    useEffect(() => { fetchTest(); }, [testId]);

    const fetchTest = async () => {
        setLoading(true);
        try {
            const data = await getLevelTestById(testId);
            setTest(data.test);
            setQuestions(data.test.questions || []);
            setPassages(data.test.passages || []);
        } catch (err) {
            setError('Lỗi tải bài test');
        } finally {
            setLoading(false);
        }
    };

    // ==================== CÂU HỎI ĐỘC LẬP ====================

    const handleCreateQuestion = async (e) => {
        e.preventDefault();
        setError('');
        const isMC = isMultipleChoiceGroup(questionData.question_group);
        let filteredOptions = null;
        if (isMC) {
            filteredOptions = questionData.options.filter(o => o && o.trim() !== '');
            if (filteredOptions.length < 2) filteredOptions = null;
        }

        try {
            await createQuestion({ ...questionData, level_test_id: testId, options: filteredOptions });
            setShowQuestionForm(false);
            setQuestionData({ question_group: 'pronunciation', section: 'SECTION A', content: '', prefix: '', suffix: '', options: ['', '', '', ''], correct_answer: 'A', explanation: '', score: 1, order: questions.length + 1, passage_id: '' });
            fetchTest();
        } catch (err) {
            setError(err.message || 'Lỗi lưu câu hỏi');
        }
    };

    const handleUpdateQuestionInline = async (id, submitData) => {
        const scrollPosition = window.scrollY;
        try {
            await updateQuestion(id, { ...submitData, level_test_id: testId });
            setEditingQuestionId(null); 
            await fetchTest();
            setTimeout(() => {
                window.scrollTo({ top: scrollPosition, behavior: 'instant' });
            }, 50);
        } catch (err) {
            console.error(err);
            alert('Lỗi cập nhật câu hỏi');
        }
    };

    // ==================== ĐIỀU CHỈNH THỨ TỰ ====================
    
    const moveQuestion = async (index, direction) => {
        const newQuestions = [...questions.filter(q => !q.passage_id)];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newQuestions.length) return;

        const temp = newQuestions[index];
        newQuestions[index] = newQuestions[targetIndex];
        newQuestions[targetIndex] = temp;

        try {
            await updateQuestion(newQuestions[index].id, { order: index + 1 });
            await updateQuestion(newQuestions[targetIndex].id, { order: targetIndex + 1 });
            fetchTest();
        } catch (err) {
            alert('Lỗi khi đổi thứ tự');
        }
    };

    // ==================== BÀI ĐỌC ====================
    
    const handlePassageSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const validQuestions = (passageData.questions || []).filter(q => q.content && q.content.trim() !== '' && q.content !== '<p><br></p>' && q.correct_answer).map((q, idx) => {
            const isMC = isMultipleChoiceGroup(q.question_group);
            let options = null;
            if (isMC && q.options) {
                const filtered = q.options.filter(o => o && o.trim() !== '');
                if (filtered.length >= 2) options = filtered;
            }
            return { ...q, options, order: idx + 1 };
        });

        try {
            if (editingPassageId) {
                await updatePassage(editingPassageId, { ...passageData, questions: validQuestions });
            } else {
                await createPassage({ ...passageData, level_test_id: testId, questions: validQuestions });
            }
            setShowPassageForm(false);
            setEditingPassageId(null);
            setPassageData({ title: '', content: '', image_url: '', image_width: '100%', source: '', questions: [] });
            fetchTest();
        } catch (err) {
            setError(err.message || 'Lỗi lưu bài đọc');
        }
    };

    if (loading) return <div style={styles.page}><div style={styles.container}>Đang tải...</div></div>;
    if (!test) return <div style={styles.page}><div style={styles.container}>Không tìm thấy bài test</div></div>;

    const independentQuestions = questions.filter(q => !q.passage_id).sort((a,b) => (a.order||0) - (b.order||0));

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>{test.title}</h1>
                        <p style={styles.subtitle}>Level {test.book_level} | {test.total_score} điểm | {test.duration} phút</p>
                    </div>
                    <button onClick={() => navigate('/admin/level-tests')} style={styles.backButton}>← Về danh sách</button>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                {/* ==================== CÂU HỎI ĐỘC LẬP ==================== */}
                <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>Câu hỏi độc lập ({independentQuestions.length})</h2>
                        <button onClick={() => { setShowQuestionForm(!showQuestionForm); setEditingQuestionId(null); }} style={styles.addButton}>
                            {showQuestionForm ? 'Đóng' : '+ Thêm câu hỏi mới'}
                        </button>
                    </div>

                    {/* Form thêm mới */}
                    {showQuestionForm && (
                        <form onSubmit={handleCreateQuestion} style={styles.form}>
                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Dạng bài</label>
                                    <select value={questionData.question_group} onChange={(e) => setQuestionData({ ...questionData, question_group: e.target.value })} style={styles.input}>
                                        {QUESTION_GROUPS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                                    </select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Tên Phần (Section)</label>
                                    <input type="text" value={questionData.section} onChange={(e) => setQuestionData({ ...questionData, section: e.target.value })} style={styles.input} placeholder="VD: SECTION A" />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Điểm</label>
                                    <input type="number" value={questionData.score} onChange={(e) => setQuestionData({ ...questionData, score: parseFloat(e.target.value) })} style={styles.input} step="0.5" />
                                </div>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Nội dung câu hỏi *</label>
                                <ReactQuill theme="snow" value={questionData.content} onChange={(val) => setQuestionData({ ...questionData, content: val })} modules={{ toolbar: [['bold', 'italic', 'underline', 'strike'], [{ color: [] }, { background: [] }], ['clean']] }} style={styles.quill} />
                            </div>
                            {isFillInBlankGroup(questionData.question_group) && (
                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}><label style={styles.label}>Tiền tố</label><input type="text" value={questionData.prefix} onChange={(e) => setQuestionData({ ...questionData, prefix: e.target.value })} style={styles.input} /></div>
                                    <div style={styles.formGroup}><label style={styles.label}>Hậu tố</label><input type="text" value={questionData.suffix} onChange={(e) => setQuestionData({ ...questionData, suffix: e.target.value })} style={styles.input} /></div>
                                </div>
                            )}

                            {/* ĐÃ SỬA LỖI: Dùng ReactQuill cho Lựa chọn */}
                            {isMultipleChoiceGroup(questionData.question_group) && (
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Các lựa chọn (A/B/C/D) - Có thể gạch chân âm tiết</label>
                                    <div style={styles.optionsGrid}>
                                        {['A', 'B', 'C', 'D'].map((label, idx) => (
                                            <div key={idx} style={{ marginBottom: '10px' }}>
                                                <span style={styles.optionLabel}>{label}.</span>
                                                <ReactQuill
                                                    theme="snow"
                                                    value={questionData.options[idx]}
                                                    onChange={(val) => { const o = [...questionData.options]; o[idx] = val; setQuestionData({ ...questionData, options: o }); }}
                                                    modules={{ toolbar: [['underline', 'clean']] }}
                                                    style={{ backgroundColor: 'white', height: '80px', marginTop: '4px' }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Đáp án đúng *</label>
                                    {isMultipleChoiceGroup(questionData.question_group) ? (
                                        <select value={questionData.correct_answer} onChange={(e) => setQuestionData({ ...questionData, correct_answer: e.target.value })} style={styles.input}><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select>
                                    ) : questionData.question_group === 'true_false' ? (
                                        <select value={questionData.correct_answer} onChange={(e) => setQuestionData({ ...questionData, correct_answer: e.target.value })} style={styles.input}><option value="True">True</option><option value="False">False</option><option value="Not Given">Not Given</option></select>
                                    ) : (
                                        <input type="text" value={questionData.correct_answer} onChange={(e) => setQuestionData({ ...questionData, correct_answer: e.target.value })} style={styles.input} />
                                    )}
                                </div>
                                <div style={styles.formGroup}><label style={styles.label}>Giải thích</label><textarea value={questionData.explanation} onChange={(e) => setQuestionData({ ...questionData, explanation: e.target.value })} style={styles.textarea} rows="2" /></div>
                            </div>
                            <button type="submit" style={styles.submitButton}>Thêm câu hỏi</button>
                        </form>
                    )}

                    {/* DANH SÁCH CÂU HỎI ĐỘC LẬP (Hỗ trợ Sửa tại chỗ và Đổi thứ tự) */}
                    {independentQuestions.length > 0 && (
                        <div style={styles.questionList}>
                            {independentQuestions.map((q, idx) => (
                                <div key={q.id} style={styles.questionCard}>
                                    {editingQuestionId === q.id ? (
                                        <InlineQuestionForm 
                                            initialData={{ ...q, options: q.options || ['', '', '', ''] }} 
                                            onSave={(data) => handleUpdateQuestionInline(q.id, data)}
                                            onCancel={() => setEditingQuestionId(null)}
                                        />
                                    ) : (
                                        <>
                                            <div style={styles.questionHeader}>
                                                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                                    <span style={styles.questionNumber}>Câu {idx + 1}</span>
                                                    <span style={styles.questionGroup}>{q.section || 'SECTION A'}</span>
                                                    
                                                    {/* Nút đổi thứ tự */}
                                                    <div style={{ display: 'flex', gap: '4px' }}>
                                                        <button onClick={() => moveQuestion(idx, -1)} disabled={idx === 0} style={styles.moveBtn}>↑</button>
                                                        <button onClick={() => moveQuestion(idx, 1)} disabled={idx === independentQuestions.length - 1} style={styles.moveBtn}>↓</button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <button onClick={() => setEditingQuestionId(q.id)} style={styles.editButton}>Sửa</button>
                                                    <button onClick={() => { if(window.confirm('Xóa?')) { deleteQuestion(q.id).then(fetchTest); } }} style={styles.deleteButton}>Xóa</button>
                                                </div>
                                            </div>
                                            <div style={styles.questionContent} dangerouslySetInnerHTML={{ __html: q.content }} />
                                            <p style={styles.correctAnswer}>Đáp án: <strong>{q.correct_answer}</strong> | Điểm: {q.score}</p>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ==================== BÀI ĐỌC ==================== */}
                <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>Bài đọc ({passages.length})</h2>
                        <button onClick={() => { setShowPassageForm(!showPassageForm); }} style={styles.addButton}>
                            {showPassageForm ? 'Đóng' : '+ Thêm bài đọc'}
                        </button>
                    </div>

                    {showPassageForm && (
                        <form onSubmit={handlePassageSubmit} style={styles.form}>
                            <div style={styles.formGroup}><label style={styles.label}>Tiêu đề</label><input type="text" value={passageData.title} onChange={(e) => setPassageData({ ...passageData, title: e.target.value })} style={styles.input} /></div>
                            <div style={styles.formGroup}><label style={styles.label}>Nội dung *</label><ReactQuill theme="snow" value={passageData.content} onChange={(val) => setPassageData({ ...passageData, content: val })} style={styles.quill} /></div>
                            
                            {/* LINK ẢNH VÀ ĐỘ RỘNG ẢNH */}
                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Link ảnh</label>
                                    <input type="text" value={passageData.image_url || ''} onChange={(e) => setPassageData({ ...passageData, image_url: e.target.value })} style={styles.input} placeholder="https://..." />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Độ rộng ảnh</label>
                                    <select value={passageData.image_width || '100%'} onChange={(e) => setPassageData({ ...passageData, image_width: e.target.value })} style={styles.input}>
                                        <option value="25%">25%</option>
                                        <option value="50%">50%</option>
                                        <option value="75%">75%</option>
                                        <option value="100%">100%</option>
                                    </select>
                                </div>
                            </div>

                            {/* NGUỒN */}
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Nguồn (chữ nhỏ)</label>
                                <input type="text" value={passageData.source || ''} onChange={(e) => setPassageData({ ...passageData, source: e.target.value })} style={styles.input} placeholder="VD: Adapted from BBC News" />
                            </div>

                            {/* PHẦN CÂU HỎI KÈM BÀI ĐỌC */}
                            <div style={styles.passageQuestionsSection}>
                                <div style={styles.passageQuestionsHeader}>
                                    <label style={styles.label}>Câu hỏi cho bài đọc ({(passageData.questions || []).length})</label>
                                    <button type="button" onClick={() => setPassageData({ ...passageData, questions: [...(passageData.questions || []), { question_group: 'reading_comprehension', section: 'SECTION A', content: '', prefix: '', suffix: '', options: ['', '', '', ''], correct_answer: 'A', explanation: '', score: 1 }] })} style={styles.addSmallButton}>+ Thêm câu hỏi</button>
                                </div>
                                {(passageData.questions || []).map((q, qIndex) => (
                                    <div key={qIndex} style={styles.passageQuestionCard}>
                                        <div style={styles.passageQuestionHeader}><strong>Câu hỏi #{qIndex + 1}</strong><button type="button" onClick={() => setPassageData({ ...passageData, questions: passageData.questions.filter((_, i) => i !== qIndex) })} style={styles.deleteButton}>Xóa</button></div>
                                        <div style={styles.formRow}>
                                            <div style={styles.formGroup}>
                                                <label style={styles.label}>Dạng câu hỏi</label>
                                                <select value={q.question_group} onChange={(e) => {
                                                    const ng = e.target.value; const nQ = [...passageData.questions];
                                                    nQ[qIndex].question_group = ng; nQ[qIndex].correct_answer = isMultipleChoiceGroup(ng) ? 'A' : (ng === 'true_false' ? 'True' : '');
                                                    setPassageData({ ...passageData, questions: nQ });
                                                }} style={styles.input}>
                                                    {QUESTION_GROUPS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                                                </select>
                                            </div>
                                            <div style={styles.formGroup}><label style={styles.label}>Section</label><input type="text" value={q.section || 'SECTION A'} onChange={(e) => { const nQ = [...passageData.questions]; nQ[qIndex].section = e.target.value; setPassageData({ ...passageData, questions: nQ }); }} style={styles.input} /></div>
                                        </div>
                                        <div style={styles.formGroup}><label style={styles.label}>Nội dung *</label><ReactQuill theme="snow" value={q.content} onChange={(val) => { const nQ = [...passageData.questions]; nQ[qIndex].content = val; setPassageData({ ...passageData, questions: nQ }); }} style={styles.quill} /></div>
                                        
                                        {isFillInBlankGroup(q.question_group) && (
                                            <div style={styles.formRow}>
                                                <div style={styles.formGroup}><label style={styles.label}>Tiền tố</label><input type="text" value={q.prefix} onChange={(e) => { const nQ = [...passageData.questions]; nQ[qIndex].prefix = e.target.value; setPassageData({ ...passageData, questions: nQ }); }} style={styles.input} /></div>
                                                <div style={styles.formGroup}><label style={styles.label}>Hậu tố</label><input type="text" value={q.suffix} onChange={(e) => { const nQ = [...passageData.questions]; nQ[qIndex].suffix = e.target.value; setPassageData({ ...passageData, questions: nQ }); }} style={styles.input} /></div>
                                            </div>
                                        )}

                                        {/* ĐÃ SỬA LỖI: Dùng ReactQuill cho Lựa chọn ở form bài đọc */}
                                        {isMultipleChoiceGroup(q.question_group) && (
                                            <div style={styles.formGroup}>
                                                <label style={styles.label}>Các lựa chọn (A/B/C/D) - Có thể gạch chân âm tiết</label>
                                                <div style={styles.optionsGrid}>
                                                    {['A', 'B', 'C', 'D'].map((label, optIdx) => (
                                                        <div key={optIdx} style={{ marginBottom: '10px' }}>
                                                            <span style={styles.optionLabel}>{label}.</span>
                                                            <ReactQuill
                                                                theme="snow"
                                                                value={(q.options || ['', '', '', ''])[optIdx] || ''}
                                                                onChange={(val) => { const nQ = [...passageData.questions]; const newOpts = [...(nQ[qIndex].options || ['', '', '', ''])]; newOpts[optIdx] = val; nQ[qIndex].options = newOpts; setPassageData({ ...passageData, questions: nQ }); }}
                                                                modules={{ toolbar: [['underline', 'clean']] }}
                                                                style={{ backgroundColor: 'white', height: '80px', marginTop: '4px' }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Đáp án đúng</label>
                                            {isMultipleChoiceGroup(q.question_group) ? (
                                                <select value={q.correct_answer} onChange={(e) => { const nQ = [...passageData.questions]; nQ[qIndex].correct_answer = e.target.value; setPassageData({ ...passageData, questions: nQ }); }} style={styles.input}><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select>
                                            ) : q.question_group === 'true_false' ? (
                                                <select value={q.correct_answer} onChange={(e) => { const nQ = [...passageData.questions]; nQ[qIndex].correct_answer = e.target.value; setPassageData({ ...passageData, questions: nQ }); }} style={styles.input}><option value="True">True</option><option value="False">False</option><option value="Not Given">Not Given</option></select>
                                            ) : (
                                                <input type="text" value={q.correct_answer} onChange={(e) => { const nQ = [...passageData.questions]; nQ[qIndex].correct_answer = e.target.value; setPassageData({ ...passageData, questions: nQ }); }} style={styles.input} />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button type="submit" style={styles.submitButton}>{editingPassageId ? 'Cập nhật bài đọc' : 'Thêm bài đọc'}</button>
                        </form>
                    )}

                    {passages.length > 0 && (
                        <div style={styles.passageList}>
                            {passages.map(p => (
                                <div key={p.id} style={styles.passageCard}>
                                    <div style={styles.passageHeader}>
                                        <strong>{p.title || '(Không tiêu đề)'}</strong>
                                        <div>
                                            <button onClick={() => { setEditingPassageId(p.id); setPassageData({...p, questions: questions.filter(q => q.passage_id === p.id)}); setShowPassageForm(true); }} style={styles.editButton}>Sửa</button>
                                            <button onClick={() => { if(window.confirm('Xóa?')) { deletePassage(p.id).then(fetchTest); } }} style={styles.deleteButton}>Xóa</button>
                                        </div>
                                    </div>
                                    <div style={styles.passageContent} dangerouslySetInnerHTML={{ __html: p.content.substring(0, 100) + '...' }} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', backgroundColor: '#F6F9FE', fontFamily: "'Inter', 'Roboto', sans-serif", padding: '40px 20px', boxSizing: 'border-box' },
    container: { maxWidth: '1000px', margin: '0 auto', width: '100%' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
    title: { fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: '800', color: '#212529', margin: 0 },
    subtitle: { fontSize: '14px', color: '#6C757D', marginTop: '4px' },
    backButton: { padding: '10px 20px', backgroundColor: '#6C757D', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
    section: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '2px solid #DCE8F5', marginBottom: '24px', boxShadow: '0 2px 12px rgba(13, 110, 253, 0.06)' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' },
    sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#212529', margin: 0 },
    addButton: { padding: '8px 16px', backgroundColor: '#0D6EFD', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
    addSmallButton: { padding: '6px 12px', backgroundColor: '#28A745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
    form: { backgroundColor: '#F8F9FA', padding: '20px', borderRadius: '10px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' },
    formRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: '600', color: '#495057' },
    input: { padding: '10px 14px', border: '1px solid #CED4DA', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: 'white', width: '100%', boxSizing: 'border-box' },
    textarea: { padding: '10px 14px', border: '1px solid #CED4DA', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: 'white', fontFamily: 'inherit', resize: 'vertical', width: '100%', boxSizing: 'border-box' },
    quill: { backgroundColor: 'white', borderRadius: '8px', marginBottom: '8px', minHeight: '100px' },
    optionsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '6px' },
    optionItem: { display: 'flex', alignItems: 'center', gap: '6px' },
    optionLabel: { fontWeight: '700', color: '#0D6EFD', width: '20px' },
    submitButton: { padding: '12px', backgroundColor: '#28A745', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
    passageList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    passageCard: { backgroundColor: '#F8F9FA', padding: '16px', borderRadius: '8px', border: '1px solid #DCE8F5' },
    passageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '8px', flexWrap: 'wrap' },
    passageContent: { fontSize: '13px', color: '#495057', margin: '4px 0', lineHeight: '1.5' },
    passageQuestionsSection: { marginTop: '20px', padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '2px dashed #DCE8F5' },
    passageQuestionsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' },
    passageQuestionCard: { backgroundColor: '#F8F9FA', padding: '16px', borderRadius: '8px', border: '1px solid #DCE8F5', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '10px' },
    passageQuestionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
    questionList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    questionCard: { backgroundColor: '#F8F9FA', padding: '16px', borderRadius: '8px', border: '1px solid #DCE8F5' },
    questionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '8px', flexWrap: 'wrap' },
    questionNumber: { fontWeight: '700', color: '#0D6EFD' },
    questionGroup: { fontSize: '11px', backgroundColor: '#E7F1FF', color: '#0D6EFD', padding: '3px 10px', borderRadius: '20px', fontWeight: '600' },
    questionContent: { fontSize: '14px', color: '#212529', margin: '8px 0', lineHeight: '1.6' },
    correctAnswer: { fontSize: '13px', color: '#28A745', marginTop: '8px', fontWeight: '600' },
    hintBox: { padding: '10px 14px', backgroundColor: '#FFF3CD', color: '#856404', borderRadius: '6px', fontSize: '13px' },
    moveBtn: { padding: '2px 8px', backgroundColor: '#E9ECEF', border: '1px solid #CED4DA', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', color: '#333' },
    editButton: { padding: '4px 10px', backgroundColor: '#FFC107', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', marginRight: '6px' },
    deleteButton: { padding: '4px 10px', backgroundColor: '#DC3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
    error: { backgroundColor: '#F8D7DA', color: '#721C24', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }
};

export default ManageLevelTestQuestions;