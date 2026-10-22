import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitOnboarding } from '../services/onboardingService';

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        goals: [],
        current_level: '',
        pain_points: '',
        specific_goals: '',
        referral_source: ''
    });

    const goalOptions = ['Du lịch', 'Công việc', 'Học tập', 'Rèn luyện', 'Kết nối', 'Khác'];
    const levelOptions = ['Mới bắt đầu', 'Đã biết chút ít', 'Đang ôn luyện chứng chỉ'];
    const referralOptions = ['Facebook/TikTok', 'Bạn bè giới thiệu', 'Tìm kiếm Google', 'Khác'];

    const handleNext = () => setStep(step + 1);

    const handleGoalToggle = (goal) => {
        const newGoals = formData.goals.includes(goal)
            ? formData.goals.filter(g => g !== goal)
            : [...formData.goals, goal];
        setFormData({ ...formData, goals: newGoals });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await submitOnboarding(formData);
            navigate('/dashboard'); // Xong thì vào Dashboard
        } catch (error) {
            alert('Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch(step) {
            case 1:
                return (
                    <div>
                        <h3 style={styles.questionTitle}>Mục tiêu học tiếng Anh của bạn là gì?</h3>
                        <p style={styles.hint}>(Có thể chọn nhiều)</p>
                        <div style={styles.optionsGrid}>
                            {goalOptions.map(goal => (
                                <button
                                    key={goal}
                                    onClick={() => handleGoalToggle(goal)}
                                    style={{
                                        ...styles.optionBtn,
                                        backgroundColor: formData.goals.includes(goal) ? '#0D6EFD' : '#F8F9FA',
                                        color: formData.goals.includes(goal) ? 'white' : '#495057',
                                        borderColor: formData.goals.includes(goal) ? '#0D6EFD' : '#CED4DA'
                                    }}
                                >
                                    {goal}
                                </button>
                            ))}
                        </div>
                        <button onClick={handleNext} disabled={formData.goals.length === 0} style={styles.nextBtn}>Tiếp tục</button>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h3 style={styles.questionTitle}>Trình độ hiện tại của bạn?</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {levelOptions.map(level => (
                                <button
                                    key={level}
                                    onClick={() => setFormData({ ...formData, current_level: level })}
                                    style={{
                                        ...styles.optionBtn,
                                        backgroundColor: formData.current_level === level ? '#0D6EFD' : '#F8F9FA',
                                        color: formData.current_level === level ? 'white' : '#495057'
                                    }}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                        <button onClick={handleNext} disabled={!formData.current_level} style={styles.nextBtn}>Tiếp tục</button>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h3 style={styles.questionTitle}>Điều gì khiến bạn khó chịu nhất khi học tiếng Anh?</h3>
                        <textarea
                            value={formData.pain_points}
                            onChange={(e) => setFormData({ ...formData, pain_points: e.target.value })}
                            placeholder="VD: Mất gốc ngữ pháp, sợ nói, không có thời gian..."
                            style={styles.textarea}
                        />
                        <button onClick={handleNext} style={styles.nextBtn}>Tiếp tục</button>
                    </div>
                );
            case 4:
                return (
                    <div>
                        <h3 style={styles.questionTitle}>Mục tiêu cụ thể của bạn trong 3 tháng tới là gì?</h3>
                        <textarea
                            value={formData.specific_goals}
                            onChange={(e) => setFormData({ ...formData, specific_goals: e.target.value })}
                            placeholder="VD: Giao tiếp tự tin với sếp Tây, thi đạt 6.0 IELTS..."
                            style={styles.textarea}
                        />
                        <button onClick={handleNext} style={styles.nextBtn}>Tiếp tục</button>
                    </div>
                );
            case 5:
                return (
                    <div>
                        <h3 style={styles.questionTitle}>Bạn biết đến EnglishIngLesh qua đâu?</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {referralOptions.map(source => (
                                <button
                                    key={source}
                                    onClick={() => setFormData({ ...formData, referral_source: source })}
                                    style={{
                                        ...styles.optionBtn,
                                        backgroundColor: formData.referral_source === source ? '#0D6EFD' : '#F8F9FA',
                                        color: formData.referral_source === source ? 'white' : '#495057'
                                    }}
                                >
                                    {source}
                                </button>
                            ))}
                        </div>
                        <button onClick={handleSubmit} disabled={!formData.referral_source || loading} style={styles.finishBtn}>
                            {loading ? 'Đang lưu...' : 'Hoàn thành & Vào học'}
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                {/* Mascot */}
                <div style={styles.mascotWrapper}>
                    <div style={styles.mascotFace}>
                        <div style={styles.eyes}>
                            <span style={styles.eye}></span>
                            <span style={styles.eye}></span>
                        </div>
                        <div style={styles.smile}></div>
                    </div>
                </div>

                {/* Khung chat */}
                <div style={styles.chatBox}>
                    <div style={styles.chatBubble}>
                        Xin chào! Mình là trợ lý ảo của EnglishIngLesh. Mình có thể hỏi bạn vài câu để cá nhân hóa lộ trình học được không?
                    </div>
                    
                    <div style={{ marginTop: '20px' }}>
                        {renderStep()}
                    </div>

                    <div style={styles.progressBar}>
                        <div style={{ ...styles.progressFill, width: `${(step / 5) * 100}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#F6F9FE',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Inter', sans-serif",
        padding: '20px'
    },
    container: {
        width: '100%',
        maxWidth: '600px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
    },
    mascotWrapper: {
        animation: 'float 3s ease-in-out infinite'
    },
    mascotFace: {
        width: '100px',
        height: '80px',
        backgroundColor: '#0D6EFD',
        borderRadius: '20px',
        position: 'relative',
        boxShadow: '0 10px 20px rgba(13, 110, 253, 0.3)'
    },
    eyes: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        paddingTop: '25px'
    },
    eye: {
        width: '12px',
        height: '12px',
        backgroundColor: 'white',
        borderRadius: '50%',
        animation: 'blink 4s infinite'
    },
    smile: {
        width: '30px',
        height: '15px',
        borderBottomLeftRadius: '15px',
        borderBottomRightRadius: '15px',
        backgroundColor: 'white',
        margin: '0 auto',
        marginTop: '10px'
    },
    chatBox: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        width: '100%',
        border: '2px solid #DCE8F5'
    },
    chatBubble: {
        backgroundColor: '#E7F1FF',
        padding: '15px 20px',
        borderRadius: '15px',
        borderBottomLeftRadius: '2px',
        color: '#0D6EFD',
        fontSize: '15px',
        fontWeight: '500',
        lineHeight: '1.5'
    },
    questionTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#212529',
        margin: '0 0 5px 0'
    },
    hint: {
        fontSize: '13px',
        color: '#6C757D',
        margin: '0 0 15px 0'
    },
    optionsGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '20px'
    },
    optionBtn: {
        padding: '10px 20px',
        borderRadius: '10px',
        border: '2px solid #CED4DA',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    textarea: {
        width: '100%',
        padding: '15px',
        borderRadius: '10px',
        border: '2px solid #CED4DA',
        fontSize: '14px',
        fontFamily: 'inherit',
        resize: 'none',
        minHeight: '100px',
        outline: 'none',
        marginBottom: '20px'
    },
    nextBtn: {
        width: '100%',
        padding: '15px',
        backgroundColor: '#0D6EFD',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '10px'
    },
    finishBtn: {
        width: '100%',
        padding: '15px',
        backgroundColor: '#28A745',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '20px'
    },
    progressBar: {
        width: '100%',
        height: '6px',
        backgroundColor: '#E9ECEF',
        borderRadius: '3px',
        marginTop: '30px',
        overflow: 'hidden'
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#0D6EFD',
        transition: 'width 0.3s ease'
    }
};

// Inject keyframes
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        @keyframes blink {
            0%, 96%, 100% { transform: scaleY(1); }
            98% { transform: scaleY(0.1); }
        }
    `;
    document.head.appendChild(styleSheet);
}

export default Onboarding;