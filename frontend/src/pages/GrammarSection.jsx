import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getUnitById, getQuestions } from '../services/unitService';

const GrammarSection = () => {
    const { unitId } = useParams();
    const [searchParams] = useSearchParams();
    const filterType = searchParams.get('type') || '';
    const navigate = useNavigate();
    
    const [unit, setUnit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [questions, setQuestions] = useState([]);
    const [totalQuestions, setTotalQuestions] = useState(0);

    useEffect(() => {
        fetchUnit();
        fetchQuestions();
    }, [unitId, filterType]);

    const fetchUnit = async () => {
        setLoading(true);
        try {
            const data = await getUnitById(unitId);
            setUnit(data.unit);
        } catch (err) {
            setError('Không thể tải nội dung');
        } finally {
            setLoading(false);
        }
    };

    const fetchQuestions = async () => {
        try {
            const data = await getQuestions(unitId, filterType);
            setQuestions(data.questions || []);
            setTotalQuestions(data.totalQuestions || 0);
        } catch (err) {
            console.error('Lỗi lấy câu hỏi:', err);
        }
    };

    if (loading) return <div style={styles.container}>Đang tải...</div>;
    if (error) return <div style={styles.container}>{error}</div>;
    if (!unit) return <div style={styles.container}>Không tìm thấy Unit</div>;

    return (
        <div style={styles.container}>
            <h1>Unit {unit.unit_number}: {unit.title}</h1>
            
            {/* Hiển thị thông tin bộ lọc */}
            {filterType && (
                <p style={styles.filterInfo}>
                    Đang lọc: <strong>{filterType.replace('_', ' ').toUpperCase()}</strong> 
                    ({totalQuestions} câu hỏi)
                </p>
            )}

            <div style={styles.content}
                dangerouslySetInnerHTML={{ __html: unit.content_html || '<p>Chưa có nội dung lý thuyết</p>' }}
            />
            
            <button 
                onClick={() => navigate(`/practice/${unitId}?type=${filterType}`)} 
                style={styles.button}
            >
                Bắt đầu làm bài tập →
            </button>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px',
        maxWidth: '900px',
        margin: '0 auto'
    },
    filterInfo: {
        backgroundColor: '#e3f2fd',
        padding: '10px 15px',
        borderRadius: '5px',
        marginBottom: '20px'
    },
    content: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        margin: '20px 0',
        lineHeight: '1.8'
    },
    button: {
        padding: '12px 30px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer'
    }
};

export default GrammarSection;