import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUnitById, getQuestions } from '../services/unitService';

const GrammarSection = () => {
    const { unitId } = useParams();
    const navigate = useNavigate();
    const [unit, setUnit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUnit();
    }, [unitId]);

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

    if (loading) return <div style={styles.container}>Đang tải...</div>;
    if (error) return <div style={styles.container}>{error}</div>;
    if (!unit) return <div style={styles.container}>Không tìm thấy Unit</div>;

    return (
        <div style={styles.container}>
            <h1>Unit {unit.unit_number}: {unit.title}</h1>
            <div style={styles.content}
                dangerouslySetInnerHTML={{ __html: unit.content_html || '<p>Chưa có nội dung lý thuyết</p>' }}
            />
            <button onClick={() => navigate(`/practice/${unitId}`)} style={styles.button}>
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