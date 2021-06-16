const passwordValidator = require('password-validator');
const fs = require('fs');

let rawdata = fs.readFileSync('commonPass.json');
let pass = JSON.parse(rawdata);

module.exports = new passwordValidator()
    .is().min(8)
    .has().uppercase()
    .has().symbols()
    .has().lowercase()
    .has().digits()
    .has().not().spaces()
    .is().not().oneOf(Object.values(pass));    






