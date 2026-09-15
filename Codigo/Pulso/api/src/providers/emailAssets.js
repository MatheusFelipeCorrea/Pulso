const fs = require('fs');
const path = require('path');

const LOGO_CID = 'pulso-logo@pulso';
const LOGO_FILENAME = 'LogoMClaro.png';
const LOGO_PATH = path.resolve(__dirname, '../../../web/public/brand/LogoMClaro.png');

/**
 * Anexo inline (CID) — garante que a logo apareça mesmo quando
 * o FRONTEND_URL não é acessível pelo cliente de email (ex.: localhost).
 */
const getLogoAttachment = () => {
    if (!fs.existsSync(LOGO_PATH)) {
        throw new Error(`Logo de email não encontrada em: ${LOGO_PATH}`);
    }

    return {
        filename: LOGO_FILENAME,
        path: LOGO_PATH,
        cid: LOGO_CID,
    };
};

const getLogoSrc = () => `cid:${LOGO_CID}`;

/** Fallback URL pública quando CID não estiver disponível. */
const getLogoPublicUrl = (frontendUrl) =>
    `${frontendUrl.replace(/\/$/, '')}/brand/LogoMClaro.png`;

module.exports = {
    LOGO_CID,
    getLogoAttachment,
    getLogoSrc,
    getLogoPublicUrl,
};
