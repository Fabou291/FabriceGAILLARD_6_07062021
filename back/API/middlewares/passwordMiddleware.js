import passwordValidator from "password-validator";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";

const getSchema = (password) => {
    const schema = new passwordValidator();

    schema
        .is().min(8)
        .has().uppercase()
        .has().lowercase()
        .has().digits()
        .has().not().spaces()
        .is().not().oneOf(["Passw0rd", "Password123"]);

    return schema;
    
};

const checkValidity = (req, res, next) => {

    if (!getSchema().validate(req.body.password)) 
        next(createHttpError.Unauthorized("Invalid Password"));
    else 
        next();
};

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
