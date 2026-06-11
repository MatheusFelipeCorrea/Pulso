const nodemailer = require('nodemailer');
const env = require('../config/env');
const { getLogoAttachment, getLogoSrc, getLogoPublicUrl } = require('./emailAssets');
const {
    buildVerificationEmailHtml,
    buildVerificationEmailText,
} = require('./emailTemplates/verificationEmail');
const {
    buildPasswordResetEmailHtml,
    buildPasswordResetEmailText,
} = require('./emailTemplates/passwordResetEmail');

let transporter;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: env.SMTP_HOST,
            port: Number(env.SMTP_PORT),
            secure: false,
            auth: {
                user: env.SMTP_USER,
                pass: env.SMTP_PASS,
            },
        });
    }
    return transporter;
};

const resolveLogoForEmail = () => {
    try {
        return {
            logoSrc: getLogoSrc(),
            attachments: [getLogoAttachment()],
        };
    } catch {
        return {
            logoSrc: getLogoPublicUrl(env.FRONTEND_URL),
            attachments: [],
        };
    }
};

const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${env.FRONTEND_URL}/verify-email/${token}`;
    const recipientEmail = email.trim().toLowerCase();
    const { logoSrc, attachments } = resolveLogoForEmail();

    await getTransporter().sendMail({
        from: {
            name: 'Pulso',
            address: env.SMTP_FROM || env.SMTP_USER,
        },
        to: recipientEmail,
        subject: '✉️ Confirme seu email — Pulso',
        text: buildVerificationEmailText({ verificationUrl, recipientEmail }),
        html: buildVerificationEmailHtml({
            verificationUrl,
            logoSrc,
            recipientEmail,
        }),
        attachments,
    });
};

const sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `${env.FRONTEND_URL}/reset-password/${token}`;
    const recipientEmail = email.trim().toLowerCase();
    const { logoSrc, attachments } = resolveLogoForEmail();

    await getTransporter().sendMail({
        from: {
            name: 'Pulso',
            address: env.SMTP_FROM || env.SMTP_USER,
        },
        to: recipientEmail,
        subject: '🔒 Recuperação de senha — Pulso',
        text: buildPasswordResetEmailText({ resetUrl, recipientEmail }),
        html: buildPasswordResetEmailHtml({
            resetUrl,
            logoSrc,
            recipientEmail,
        }),
        attachments,
    });
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
};
