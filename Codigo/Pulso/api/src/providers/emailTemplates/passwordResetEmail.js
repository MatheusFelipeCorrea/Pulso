/**
 * Template HTML — recuperação de senha
 */

const buildPasswordResetEmailHtml = ({ resetUrl, logoSrc, recipientEmail }) => {
    const year = new Date().getFullYear();

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Recuperação de senha — Pulso</title>
</head>
<body style="margin:0;padding:0;width:100%;background-color:#F4F4F5;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F4F4F5;">
    <tr>
      <td align="center" style="padding:40px 16px 48px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <img src="${logoSrc}" alt="Pulso" width="120" height="36" style="display:block;height:36px;width:auto;max-width:120px;border:0;" />
              <p style="margin:8px 0 0;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;color:#71717A;">
                Seu monitoramento financeiro
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#FFFFFF;border-radius:20px;border:1px solid #E4E4E7;overflow:hidden;box-shadow:0 4px 24px rgba(124,58,237,0.08);">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="background:linear-gradient(145deg,#FAFAFA 0%,#F5F3FF 42%,#EDE9FE 100%);padding:36px 32px 28px;text-align:center;border-bottom:1px solid #EDE9FE;">
                    <div style="display:inline-block;width:56px;height:56px;line-height:56px;border-radius:50%;background-color:#7C3AED;text-align:center;font-size:26px;">🔒</div>
                    <h1 style="margin:20px 0 0;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:26px;font-weight:700;color:#18181B;">
                      Recuperação de <span style="color:#7C3AED;">senha</span>
                    </h1>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding:32px;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                    <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#52525B;">
                      Você solicitou a redefinição de senha da conta <strong style="color:#18181B;">${recipientEmail}</strong>.
                      Clique no botão abaixo para criar uma nova senha.
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:28px 0;">
                      <tr>
                        <td align="center">
                          <a href="${resetUrl}" style="display:inline-block;background-color:#7C3AED;color:#FFFFFF;font-size:15px;font-weight:600;text-decoration:none;padding:14px 28px;border-radius:10px;">
                            Redefinir senha
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#71717A;">
                      Este link expira em <strong>1 hora</strong> por segurança.
                    </p>
                    <p style="margin:0;font-size:13px;line-height:1.6;color:#A1A1AA;">
                      Se você não solicitou esta recuperação, ignore este email com segurança.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:24px;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:12px;color:#A1A1AA;">
              © ${year} Pulso — Este é um email automático, por favor não responda.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const buildPasswordResetEmailText = ({ resetUrl, recipientEmail }) =>
    [
        'Recuperação de senha — Pulso',
        '',
        `Você solicitou redefinir a senha da conta ${recipientEmail}.`,
        '',
        `Redefinir senha: ${resetUrl}`,
        '',
        'Este link expira em 1 hora.',
        'Se você não solicitou, ignore este email.',
    ].join('\n');

module.exports = {
    buildPasswordResetEmailHtml,
    buildPasswordResetEmailText,
};
