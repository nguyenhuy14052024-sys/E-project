const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'EnglishIngLesh <onboarding@resend.dev>',
            to: [to],
            subject: subject,
            html: html,
        });

        if (error) {
            console.error('❌ Resend API error:', error);
            throw error;
        }

        console.log('✅ Email sent via Resend:', data.id);
        return data;
    } catch (error) {
        console.error('❌ Email error:', error);
        throw error;
    }
};

module.exports = { sendEmail };