import userValidation from "../validations/userValidations.js";
import bcrypt from "bcrypt";

const parse = (req, res, next) => {
    if (!userValidation.isAValidPassword(req.body.password))
        return res.status(401).json({ message: "Invalid Password" });

    next();
};

const encrypt = async (req, res, next) => {
    req.body.password = await bcrypt.hash(req.body.password, 10);

    next();
};

export default { parse, encrypt };
