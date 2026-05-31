const nodemailer = require('nodemailer');
const env = require('../config/env');
const {
    buildVerificationEmailHtml,
    buildVerificationEmailText,
} = require('./emailTemplates/verificationEmail');
const {
    buildPasswordResetEmailHtml,
    buildPasswordResetEmailText,
} = require('./emailTemplates/passwordResetEmail');

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: false,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});

const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${env.FRONTEND_URL}/verify-email/${token}`;
    const recipientEmail = email.trim().toLowerCase();

    await transporter.sendMail({
        from: {
            name: 'Pulso',
            address: env.SMTP_FROM || env.SMTP_USER,
        },
        to: recipientEmail,
        subject: '✉️ Confirme seu email — Pulso',
        text: buildVerificationEmailText({ verificationUrl, recipientEmail }),
        html: buildVerificationEmailHtml({
            verificationUrl,
            frontendUrl: env.FRONTEND_URL,
            recipientEmail,
        }),
    });
};

const sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `${env.FRONTEND_URL}/reset-password/${token}`;
    const recipientEmail = email.trim().toLowerCase();

    await transporter.sendMail({
        from: {
            name: 'Pulso',
            address: env.SMTP_FROM || env.SMTP_USER,
        },
        to: recipientEmail,
        subject: '🔒 Recuperação de senha — Pulso',
        text: buildPasswordResetEmailText({ resetUrl, recipientEmail }),
        html: buildPasswordResetEmailHtml({
            resetUrl,
            frontendUrl: env.FRONTEND_URL,
            recipientEmail,
        }),
    });
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
};
