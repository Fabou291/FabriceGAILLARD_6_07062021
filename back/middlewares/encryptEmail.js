const crypto = require('crypto');
const configGlobal = require('../config/global');

module.exports = (req, res, next) => {
    const encrypter = crypto.createCipheriv(
        'aes-256-gcm',
        crypto.createHash('sha256').update(String(configGlobal.encryptEmailKeys.key)).digest('base64').substr(0, 32), 
        configGlobal.encryptEmailKeys.iv
    );

    req.body.email = encrypter.update(req.body.email, 'utf8', 'hex');

    next();
}



