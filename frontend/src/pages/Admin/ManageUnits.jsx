import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUnits, createUnit, updateUnit, deleteUnit } from '../../services/adminService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ManageUnits = () => {
    const navigate = useNavigate();
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        book_level: 'A1',
        unit_number: '',
        title: '',
        type: 'grammar',
        description: '',
        difficulty: 1,
        note: '',
        parts: []
    });

    useEffect(() => {
        fetchUnits();
    }, []);

    const fetchUnits = async () => {
        setLoading(true);
        try {
            const data = await getAllUnits();
            setUnits(data.units || []);
        } catch (err) {
            setError('Lỗi tải danh sách Unit');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (editingId) {
                await updateUnit(editingId, formData);
            } else {
                await createUnit(formData);
            }
            resetForm();
            fetchUnits();
        } catch (err) {
            setError(err.message || 'Lỗi lưu Unit');
        }
    };

    const handleEdit = (unit) => {
    setEditingId(unit.id);
    
    // Đảm bảo parts là mảng phẳng, không lồng nhau
    let cleanParts = [];
    if (Array.isArray(unit.parts)) {
        cleanParts = unit.parts
            .filter(p => p !== null && typeof p === 'object' && !Array.isArray(p))
            .map(p => ({
                title: p.title || '',
                content: p.content || ''
            }));
    }
    
    setFormData({
        book_level: unit.book_level,
        unit_number: unit.unit_number,
        title: unit.title,
        type: unit.type,
        description: unit.description || '',
        difficulty: unit.difficulty || 1,
        note: unit.note || '',
        parts: cleanParts  // ← Dùng mảng đã làm sạch
    });
    setShowForm(true);
};


    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa Unit này? Tất cả câu hỏi của nó cũng sẽ bị xóa.')) {
            try {
                await deleteUnit(id);
                fetchUnits();
            } catch (err) {
                setError('Lỗi xóa Unit');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            book_level: 'A1',
            unit_number: '',
            title: '',
            type: 'grammar',
            description: '',
            difficulty: 1,
            note: '',
            parts: []
        });
        setShowForm(false);
        setEditingId(null);
    };

    const addPart = () => {
    setFormData({
        ...formData,
        parts: [...formData.parts, { title: '', content: '' }]  // ← Object, không phải mảng
    });
};

const removePart = (index) => {
    const newParts = formData.parts.filter((_, i) => i !== index);
    setFormData({ ...formData, parts: newParts });
};

const updatePart = (index, field, value) => {
    const newParts = [...formData.parts];
    newParts[index] = { ...newParts[index], [field]: value };  // ← Sửa đúng cách
    setFormData({ ...formData, parts: newParts });
};

    if (loading) return <div style={styles.container}>Đang tải...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Quản lý Unit</h1>
                <div>
                    <button onClick={() => navigate('/admin')} style={styles.backButton}>
                        Về Admin
                    </button>
                    <button onClick={() => { resetForm(); setShowForm(!showForm); }} style={styles.addButton}>
                        {showForm ? 'Đóng' : '+ Thêm Unit'}
                    </button>
                </div>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            {showForm && (
                <form onSubmit={handleSubmit} style={styles.form}>
                    <h3 style={styles.formTitle}>Thông tin chung</h3>
                    
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
                            <label style={styles.label}>Số Unit</label>
                            <input
                                type="number"
                                placeholder="Số Unit"
                                value={formData.unit_number}
                                onChange={(e) => setFormData({ ...formData, unit_number: parseInt(e.target.value) })}
                                style={styles.input}
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Loại</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                style={styles.input}
                            >
                                <option value="grammar">Ngữ pháp</option>
                                <option value="vocabulary">Từ vựng</option>
                                <option value="mixed">Tổng hợp</option>
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Độ khó</label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: parseInt(e.target.value) })}
                                style={styles.input}
                            >
                                <option value="1">Dễ</option>
                                <option value="2">Trung bình</option>
                                <option value="3">Khó</option>
                            </select>
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Tên Unit</label>
                        <input
                            type="text"
                            placeholder="Tên Unit"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Mô tả</label>
                        <input
                            type="text"
                            placeholder="Mô tả ngắn"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Ghi chú (trang trí, cách trình bày)</label>
                        <textarea
                            placeholder="Ghi chú về trang trí, cách trình bày"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            style={styles.textarea}
                            rows="3"
                        />
                    </div>

                    <h3 style={styles.formTitle}>Các phần nội dung</h3>
                    
                    {formData.parts.map((part, index) => (
                        <div key={index} style={styles.partBox}>
                            <div style={styles.partHeader}>
                                <strong>Phần {index + 1}</strong>
                                <button 
                                    type="button" 
                                    onClick={() => removePart(index)}
                                    style={styles.removeButton}
                                >
                                    Xóa
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="Tiêu đề phần"
                                value={part.title}
                                onChange={(e) => updatePart(index, 'title', e.target.value)}
                                style={styles.input}
                            />
                            <ReactQuill
    theme="snow"
    value={part.content}
    onChange={(value) => updatePart(index, 'content', value)}
    placeholder="Nội dung phần"
    modules={{
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'header': [1, 2, 3, false] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean']
        ]
    }}
    style={styles.quill}
/>
                        </div>
                    ))}

                    <button type="button" onClick={addPart} style={styles.addPartButton}>
                        + Thêm phần
                    </button>

                    <button type="submit" style={styles.submitButton}>
                        {editingId ? 'Cập nhật' : 'Thêm Unit'}
                    </button>
                </form>
            )}

            {units.length === 0 ? (
                <div style={styles.emptyState}>Chưa có Unit nào</div>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Level</th>
                            <th style={styles.th}>Unit</th>
                            <th style={styles.th}>Tên</th>
                            <th style={styles.th}>Loại</th>
                            <th style={styles.th}>Độ khó</th>
                            <th style={styles.th}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {units.map((unit) => (
                            <tr key={unit.id}>
                                <td style={styles.td}>
                                    <span style={styles.levelBadge}>{unit.book_level}</span>
                                </td>
                                <td style={styles.td}>{unit.unit_number}</td>
                                <td style={styles.td}>{unit.title}</td>
                                <td style={styles.td}>{unit.type}</td>
                                <td style={styles.td}>
                                    {unit.difficulty === 1 ? 'Dễ' : unit.difficulty === 2 ? 'Trung bình' : 'Khó'}
                                </td>
                                <td style={styles.td}>
                                    <button onClick={() => handleEdit(unit)} style={styles.editButton}>Sửa</button>
                                    <button onClick={() => handleDelete(unit.id)} style={styles.deleteButton}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const styles = {
    container: { padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', 'Roboto', sans-serif" },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    backButton: { padding: '10px 20px', backgroundColor: '#6C757D', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginRight: '10px' },
    addButton: { padding: '10px 20px', backgroundColor: '#0D6EFD', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
   form: { 
    backgroundColor: '#F8F9FA', 
    padding: '32px', 
    borderRadius: '12px', 
    marginBottom: '24px',
    maxWidth: '100%'
},
    formTitle: { fontSize: '18px', fontWeight: '700', color: '#212529', marginBottom: '16px', marginTop: '16px' },
    formRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' },
    label: { fontSize: '13px', fontWeight: '600', color: '#495057' },
    input: { 
    padding: '12px 16px', 
    border: '1px solid #CED4DA', 
    borderRadius: '8px', 
    fontSize: '14px', 
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
},
    textarea: { 
    padding: '12px 16px', 
    border: '1px solid #CED4DA', 
    borderRadius: '8px', 
    fontSize: '14px', 
    fontFamily: 'inherit', 
    outline: 'none',
    width: '100%',
    minHeight: '120px',
    resize: 'vertical',
    lineHeight: '1.6'
},
quill: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    marginBottom: '10px',
    minHeight: '150px'
},
   partBox: { 
    backgroundColor: '#FFFFFF', 
    padding: '20px', 
    borderRadius: '8px', 
    marginBottom: '16px', 
    border: '1px solid #DCE8F5',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
},
    partHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
    removeButton: { padding: '6px 12px', backgroundColor: '#DC3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
    addPartButton: { padding: '10px 20px', backgroundColor: '#17A2B8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginRight: '10px', marginTop: '12px' },
    submitButton: { padding: '12px 30px', backgroundColor: '#28A745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', marginTop: '12px' },
    table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    th: { backgroundColor: '#F8F9FA', padding: '12px', textAlign: 'left', borderBottom: '2px solid #DCE8F5', fontSize: '14px' },
    td: { padding: '12px', borderBottom: '1px solid #EEE', fontSize: '14px' },
    levelBadge: { display: 'inline-block', padding: '3px 10px', backgroundColor: '#0D6EFD', color: 'white', borderRadius: '3px', fontSize: '12px' },
    editButton: { padding: '5px 12px', backgroundColor: '#FFC107', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '5px', fontSize: '13px' },
    deleteButton: { padding: '5px 12px', backgroundColor: '#DC3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
    error: { backgroundColor: '#F8D7DA', color: '#721C24', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
    emptyState: { textAlign: 'center', padding: '40px', color: '#6C757D' }
};

export default ManageUnits;