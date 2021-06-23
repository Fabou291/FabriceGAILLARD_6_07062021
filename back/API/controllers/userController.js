import userModel from "../models/userModel.js";
import createHttpError from "http-errors";

const create = (req, res, next) => {
    const user = new userModel({
        email: req.body.email,
        password: req.body.password,
    });

    user.save()
        .then((user) => { res.status(201).json({ user }); })
        .catch((error) => {
            next(createHttpError.BadRequest(
                error.code && error.code == 11000 ? "Email already used" : "Impossible to create"
            ));
        });
};


export default { create };
