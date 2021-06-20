import userValidation from "../validations/userValidations.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const parse = (req, res, next) => {
    if (!userValidation.isAValidEmail(req.body.email))
        return res.status(401).json({ message: "Invalid email" });

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

export default { parse, encrypt} ;
