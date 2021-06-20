import userValidation from "../validations/userValidations.js";

export default function (req, res, next) {
    if (!userValidation.isAValidPassword(req.body.password))
        return res.status(401).json({ message: "Invalid Password" });

    next();
}
