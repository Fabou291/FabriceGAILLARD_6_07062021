import passwordValidator from "password-validator";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import fs from 'fs';

/**
 * @function getSchema
 * @description Détermine la conformité du mot de passe
 * @param {*} password 
 * @returns {Object}
 */
const getSchema = (password) => {
    const rawdata = fs.readFileSync('commonPass.json');

    return new passwordValidator()
        .is().min(8)
        .has().uppercase()
        .has().symbols()
        .has().lowercase()
        .has().digits()
        .has().not().spaces()
        .is().not().oneOf(Object.values(JSON.parse(rawdata)));   
};

/**
 * @function checkValidity
 * @description Vérifie la conformité du mot de passe
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const checkValidity = (req, res, next) => {
    if (!getSchema().validate(req.body.password)) 
        next(createHttpError.Unauthorized("Invalid Password"));
    else 
        next();
};

/**
 * @function encrypt
 * @descripted Hash le mot de passe
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const encrypt = (req, res, next) => {
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            req.body.password = hash;
            next();
        })
        .catch((error) => next(createHttpError.InternalServerError(`bcrypt Error : ${error.message}`)));
};

export default { encrypt, checkValidity };
