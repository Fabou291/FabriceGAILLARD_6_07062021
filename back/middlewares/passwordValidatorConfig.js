const passwordValidator = require('password-validator');

module.exports = new passwordValidator()
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().symbols()
    .has().lowercase()
    .has().digits(2)
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123']);


