/**
 * Envia email de verificação de teste.
 *
 * Uso:
 *   node scripts/send-test-email.js
 *   node scripts/send-test-email.js seu@email.com
 */
require('dotenv').config();

const crypto = require('crypto');
const { sendVerificationEmail } = require('../src/providers/emailProvider');

const email = process.argv[2] || 'teste@example.com';
const token = crypto.randomBytes(32).toString('hex');

console.log('📧 Pulso — teste de email');
console.log(`   Host: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`);
console.log(`   Para: ${email}`);
console.log('');

sendVerificationEmail(email, token)
    .then(() => {
        console.log('✅ Enviado com sucesso!');
        console.log('');
        if (process.env.SMTP_HOST?.includes('sandbox')) {
            console.log('   Modo SANDBOX → veja em https://mailtrap.io (Email Testing → inbox)');
            console.log('   O email NÃO chega no Gmail neste modo.');
        } else {
            console.log('   Modo SENDING → confira a caixa de entrada real + Email Logs no Mailtrap');
        }
        console.log('');
        console.log(`   Link de teste: ${process.env.FRONTEND_URL}/verify-email/${token}`);
        console.log('   (token não está no banco — só serve para ver o HTML)');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Falha:', error.message);
        process.exit(1);
    });
