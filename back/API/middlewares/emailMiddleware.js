import crypto from "crypto";
import createHttpError from "http-errors";
import emailValidator from "email-validator"
import dotenv from "dotenv";
dotenv.config();


const checkValidity = (req, res, next) => {
    if (!emailValidator.validate(req.body.email)) 
        next(createHttpError.Unauthorized('invalid email'));

    next();
};

const encrypt = (req, res, next) => {

    req.body.email = crypto
        .createCipheriv(
            "aes-256-gcm",
            crypto
                .createHash("sha256")
                .update(process.env.SECRET_EMAIL_KEY)
                .digest("base64")
                .substr(0, 32),
                process.env.SECRET_EMAIL_IV
        )
        .update(req.body.email, "utf8", "hex");

    next();
};


export default { encrypt, checkValidity} ;
