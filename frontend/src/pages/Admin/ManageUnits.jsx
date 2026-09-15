import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUnits, createUnit, updateUnit, deleteUnit } from '../../services/adminService';

const ManageUnits = () => {
    const navigate = useNavigate();
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        book_level: 'B2',
        unit_number: '',
        title: '',
        type: 'grammar',
        description: '',
        content_html: ''
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
        setFormData({
            book_level: unit.book_level,
            unit_number: unit.unit_number,
            title: unit.title,
            type: unit.type,
            description: unit.description || '',
            content_html: unit.content_html || ''
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
            book_level: 'B2',
            unit_number: '',
            title: '',
            type: 'grammar',
            description: '',
            content_html: ''
        });
        setShowForm(false);
        setEditingId(null);
    };

    if (loading) return <div style={styles.container}>Đang tải...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>📚 Quản lý Unit</h1>
                <div>
                    <button onClick={() => navigate('/admin')} style={styles.backButton}>
                        ← Về Admin
                    </button>
                    <button onClick={() => { resetForm(); setShowForm(!showForm); }} style={styles.addButton}>
                        {showForm ? 'Đóng' : '+ Thêm Unit'}
                    </button>
                </div>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            {showForm && (
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formRow}>
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
                        <input
                            type="number"
                            placeholder="Số Unit"
                            value={formData.unit_number}
                            onChange={(e) => setFormData({ ...formData, unit_number: parseInt(e.target.value) })}
                            style={styles.input}
                            required
                        />
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            style={styles.input}
                        >
                            <option value="grammar">Ngữ pháp</option>
                            <option value="vocabulary">Từ vựng</option>
                        </select>
                    </div>
                    <input
                        type="text"
                        placeholder="Tên Unit *"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        style={styles.input}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Mô tả"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        style={styles.input}
                    />
                    <textarea
                        placeholder="Nội dung lý thuyết (HTML)"
                        value={formData.content_html}
                        onChange={(e) => setFormData({ ...formData, content_html: e.target.value })}
                        style={styles.textarea}
                        rows="5"
                    />
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
                            <th style={styles.th}>Câu hỏi</th>
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
                                <td style={styles.td}>{unit.questionCount || 0}</td>
                                <td style={styles.td}>
                                    <button onClick={() => handleEdit(unit)} style={styles.editButton}>✏️</button>
                                    <button onClick={() => handleDelete(unit.id)} style={styles.deleteButton}>🗑️</button>
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
    container: {
        padding: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    backButton: {
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginRight: '10px'
    },
    addButton: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
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
    formRow: {
        display: 'flex',
        gap: '10px'
    },
    input: {
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '14px',
        flex: 1
    },
    textarea: {
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '14px',
        fontFamily: 'monospace'
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
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'white',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    th: {
        backgroundColor: '#f8f9fa',
        padding: '12px',
        textAlign: 'left',
        borderBottom: '2px solid #dee2e6',
        fontSize: '14px'
    },
    td: {
        padding: '12px',
        borderBottom: '1px solid #eee',
        fontSize: '14px'
    },
    levelBadge: {
        display: 'inline-block',
        padding: '3px 10px',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '3px',
        fontSize: '12px'
    },
    editButton: {
        padding: '5px 10px',
        backgroundColor: '#ffc107',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        marginRight: '5px'
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

export default ManageUnits;