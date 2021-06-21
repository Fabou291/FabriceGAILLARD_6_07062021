import userValidation from "../validations/userValidations.js";
import bcrypt from "bcrypt";

const parse = (req, res, next) => {
    if (!userValidation.isAValidPassword(req.body.password))
        return res.status(401).json({ message: "Invalid Password" });

    next();
};

const encrypt = (req, res, next) => {
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            req.body.password = hash;
            next();
        })
        .catch((error) => res.status(401).json({ error }));
};

export default { parse, encrypt };
