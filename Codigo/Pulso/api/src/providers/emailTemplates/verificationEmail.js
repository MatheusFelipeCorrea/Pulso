/**
 * Template HTML — verificação de email (compatível com clientes de email)
 */

const buildVerificationEmailHtml = ({ verificationUrl, frontendUrl, recipientEmail }) => {
    const logoUrl = `${frontendUrl}/LogoMClaro.png`;
    const year = new Date().getFullYear();

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Verifique seu email — Pulso</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;width:100%;background-color:#F4F4F5;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    Confirme seu email para ativar sua conta no Pulso e começar a organizar suas finanças.
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F4F4F5;">
    <tr>
      <td align="center" style="padding:40px 16px 48px;">

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;">

          <!-- Logo acima do card -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <img src="${logoUrl}" alt="Pulso" width="120" height="36" style="display:block;height:36px;width:auto;max-width:120px;border:0;" />
              <p style="margin:8px 0 0;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;line-height:1.4;color:#71717A;">
                Seu monitoramento financeiro
              </p>
            </td>
          </tr>

          <!-- Card principal -->
          <tr>
            <td style="background-color:#FFFFFF;border-radius:20px;border:1px solid #E4E4E7;overflow:hidden;box-shadow:0 4px 24px rgba(124,58,237,0.08);">

              <!-- Faixa hero -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="background:linear-gradient(145deg,#FAFAFA 0%,#F5F3FF 42%,#EDE9FE 100%);padding:36px 32px 28px;text-align:center;border-bottom:1px solid #EDE9FE;">
                    <div style="display:inline-block;width:56px;height:56px;line-height:56px;border-radius:50%;background-color:#7C3AED;text-align:center;font-size:26px;">
                      ✉️
                    </div>
                    <h1 style="margin:20px 0 0;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:26px;font-weight:700;line-height:1.25;letter-spacing:-0.02em;color:#18181B;">
                      Bem-vindo ao <span style="color:#7C3AED;">Pulso</span>!
                    </h1>
                    <p style="margin:12px 0 0;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:15px;line-height:1.6;color:#71717A;">
                      Falta só um passo para ativar sua conta.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Corpo -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding:32px 32px 28px;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

                    <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#52525B;">
                      Olá! Obrigado por se cadastrar. Confirme seu endereço de email para desbloquear todas as funcionalidades do Pulso.
                    </p>

                    <!-- Email destino -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:28px;">
                      <tr>
                        <td style="background-color:rgba(124,58,237,0.08);border-radius:12px;padding:14px 16px;text-align:center;">
                          <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#7C3AED;">
                            Email cadastrado
                          </p>
                          <p style="margin:0;font-size:15px;font-weight:600;color:#5B21B6;word-break:break-all;">
                            ${recipientEmail}
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:28px;">
                      <tr>
                        <td align="center">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td align="center" style="border-radius:10px;background-color:#7C3AED;box-shadow:0 4px 14px rgba(124,58,237,0.35);">
                                <a href="${verificationUrl}" target="_blank" style="display:inline-block;padding:15px 36px;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:16px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:10px;">
                                  Verificar meu email
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Aviso -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:24px;">
                      <tr>
                        <td style="background-color:#EFF6FF;border-left:4px solid #3B82F6;border-radius:0 12px 12px 0;padding:14px 16px;">
                          <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#18181B;">
                            ⏱ Link válido por 24 horas
                          </p>
                          <p style="margin:0;font-size:13px;line-height:1.5;color:#71717A;">
                            Após esse prazo, solicite um novo email na tela de cadastro.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0;font-size:13px;line-height:1.6;color:#A1A1AA;">
                      Se o botão não funcionar, copie e cole este link no navegador:
                    </p>
                    <p style="margin:8px 0 0;font-size:12px;line-height:1.5;color:#7C3AED;word-break:break-all;">
                      <a href="${verificationUrl}" style="color:#7C3AED;text-decoration:underline;">${verificationUrl}</a>
                    </p>

                  </td>
                </tr>
              </table>

              <!-- Rodapé interno -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding:20px 32px;background-color:#FAFAFA;border-top:1px solid #E4E4E7;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                    <p style="margin:0;font-size:12px;line-height:1.55;color:#A1A1AA;text-align:center;">
                      Se você não criou uma conta no Pulso, ignore este email com segurança.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Rodapé externo -->
          <tr>
            <td align="center" style="padding:24px 16px 0;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
              <p style="margin:0 0 6px;font-size:12px;color:#A1A1AA;">
                © ${year} Pulso · O pulso da sua vida financeira
              </p>
              <p style="margin:0;font-size:11px;color:#D4D4D8;">
                Este é um email automático, por favor não responda.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const buildVerificationEmailText = ({ verificationUrl, recipientEmail }) =>
    [
        'Bem-vindo ao Pulso!',
        '',
        'Obrigado por se cadastrar. Confirme seu email para ativar sua conta:',
        '',
        recipientEmail,
        '',
        `Verificar email: ${verificationUrl}`,
        '',
        'Este link expira em 24 horas.',
        '',
        'Se você não criou esta conta, ignore este email.',
        '',
        '— Pulso · Seu monitoramento financeiro',
    ].join('\n');

module.exports = {
    buildVerificationEmailHtml,
    buildVerificationEmailText,
};
