import React from 'react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <button onClick={() => navigate(-1)} style={styles.backButton}>← Quay lại</button>
                <h1 style={styles.title}>Điều khoản sử dụng</h1>
                <div style={styles.content}>
                    <h2>1. Chấp nhận điều khoản</h2>
                    <p>Khi truy cập và sử dụng EnglishIngLesh, bạn đồng ý tuân thủ các điều khoản được nêu tại đây.</p>

                    <h2>2. Tài khoản người dùng</h2>
                    <p>Bạn có trách nhiệm bảo mật thông tin tài khoản và mật khẩu của mình. Mọi hoạt động diễn ra dưới tài khoản của bạn đều thuộc trách nhiệm của bạn.</p>

                    <h2>3. Nội dung và bản quyền</h2>
                    <p>Toàn bộ nội dung trên EnglishIngLesh (bài học, câu hỏi, hình ảnh) được biên soạn bởi đội ngũ phát triển. Bạn không được sao chép, phân phối lại mà không có sự cho phép.</p>

                    <h2>4. Hành vi bị cấm</h2>
                    <p>Bạn không được sử dụng nền tảng vào mục đích bất hợp pháp, phá hoại hệ thống, hoặc gây ảnh hưởng đến người dùng khác.</p>

                    <h2>5. Thay đổi điều khoản</h2>
                    <p>Chúng tôi có quyền thay đổi điều khoản bất kỳ lúc nào. Người dùng có trách nhiệm cập nhật các thay đổi.</p>

                    <h2>6. Liên hệ</h2>
                    <p>Mọi thắc mắc về điều khoản, vui lòng liên hệ: nguyenhuy14052024@gmail.com</p>

                    <p style={styles.updated}>Cập nhật lần cuối: 11/10/2026</p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#F6F9FE',
        fontFamily: "'Inter', 'Roboto', sans-serif",
        padding: '40px 24px'
    },
    container: {
        maxWidth: '800px',
        margin: '0 auto'
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
        marginBottom: '24px'
    },
    title: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#212529',
        marginBottom: '24px'
    },
    content: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '48px 40px',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        lineHeight: '1.8'
    },
    updated: {
        marginTop: '32px',
        fontSize: '13px',
        color: '#6C757D',
        fontStyle: 'italic'
    }
};

export default Terms;