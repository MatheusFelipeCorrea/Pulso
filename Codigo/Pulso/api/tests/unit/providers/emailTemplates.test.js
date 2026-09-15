const {
    buildVerificationEmailHtml,
    buildVerificationEmailText,
} = require('../../../src/providers/emailTemplates/verificationEmail');
const {
    buildPasswordResetEmailHtml,
    buildPasswordResetEmailText,
} = require('../../../src/providers/emailTemplates/passwordResetEmail');

describe('email templates auth', () => {
    it('verificação mantém o CTA web e inclui deep link do app', () => {
        const verificationUrl = 'http://localhost:5173/verify-email/tok';
        const appUrl = 'pulso://verify-email?token=tok';
        const html = buildVerificationEmailHtml({
            verificationUrl,
            appUrl,
            logoSrc: 'cid:logo',
            recipientEmail: 'ana@pulso.dev',
        });
        const text = buildVerificationEmailText({
            verificationUrl,
            appUrl,
            recipientEmail: 'ana@pulso.dev',
        });

        expect(html).toContain(verificationUrl);
        expect(html).toContain(appUrl);
        expect(html).toContain('Abrir no aplicativo');
        expect(text).toContain(`Verificar email: ${verificationUrl}`);
        expect(text).toContain(`Abrir no aplicativo: ${appUrl}`);
    });

    it('reset mantém o CTA web e inclui deep link do app', () => {
        const resetUrl = 'http://localhost:5173/reset-password/tok';
        const appUrl = 'pulso://reset-password?token=tok';
        const html = buildPasswordResetEmailHtml({
            resetUrl,
            appUrl,
            logoSrc: 'cid:logo',
            recipientEmail: 'ana@pulso.dev',
        });
        const text = buildPasswordResetEmailText({
            resetUrl,
            appUrl,
            recipientEmail: 'ana@pulso.dev',
        });

        expect(html).toContain(resetUrl);
        expect(html).toContain(appUrl);
        expect(text).toContain(`Redefinir senha: ${resetUrl}`);
        expect(text).toContain(`Abrir no aplicativo: ${appUrl}`);
    });
});
