import React from 'react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <button onClick={() => navigate(-1)} style={styles.backButton}>← Quay lại</button>
                <h1 style={styles.title}>Chính sách bảo mật</h1>
                <div style={styles.content}>
                    <h2>1. Thông tin chúng tôi thu thập</h2>
                    <p>Chúng tôi thu thập các thông tin sau khi bạn đăng ký tài khoản: tên người dùng, địa chỉ email, và mật khẩu (được mã hóa).</p>

                    <h2>2. Mục đích sử dụng thông tin</h2>
                    <p>Thông tin của bạn được sử dụng để: xác thực tài khoản, cá nhân hóa trải nghiệm học tập, gửi thông báo về tiến độ học tập, và hỗ trợ khi bạn cần.</p>

                    <h2>3. Bảo mật thông tin</h2>
                    <p>Mật khẩu của bạn được mã hóa bằng bcrypt. Chúng tôi không lưu trữ mật khẩu dưới dạng văn bản thuần. Mọi kết nối đều được bảo vệ bằng HTTPS khi triển khai.</p>

                    <h2>4. Chia sẻ thông tin</h2>
                    <p>Chúng tôi không bán, trao đổi, hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba mà không có sự đồng ý.</p>

                    <h2>5. Quyền của người dùng</h2>
                    <p>Bạn có quyền: truy cập, chỉnh sửa, hoặc xóa thông tin cá nhân của mình. Liên hệ chúng tôi để được hỗ trợ.</p>

                    <h2>6. Cookies</h2>
                    <p>Chúng tôi sử dụng localStorage để lưu token đăng nhập. Bạn có thể xóa dữ liệu này bất kỳ lúc nào bằng cách đăng xuất.</p>

                    <h2>7. Liên hệ</h2>
                    <p>Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ: nguyenhuy14052024@gmail.com</p>

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

export default Privacy;