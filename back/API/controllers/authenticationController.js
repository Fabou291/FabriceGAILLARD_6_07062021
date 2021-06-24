import userModel from "../models/userModel.js";
import authenticationHelper from "../helpers/authenticationHelper.js";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import ipController from "./ipController.js";
import ipModel from "../models/ipModel.js";

const login = async (req, res, next) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) throw createHttpError.NotFound("User not found");

        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPassword) {
            ++req.ipEntity.attempt;

            ipModel
                .updateOne({ ip: req.ipEntity.ip }, req.ipEntity)
                .then(() => {
                    throw createHttpError.Unauthorized(
                        `invalid password, remaining attempt : ${process.env.ATTEMPT_PASSWORD_LIMIT - req.ipEntity.attempt}`
                    );
                })
                .catch((error) => next(error));
                
        } else {
            ipModel
                .deleteOne({ ip: req.connection.remoteAddress })
                .then(() => {
                    res.status(200).json({ userId: user._id, token: authenticationHelper.createToken(user._id) });
                })
                .catch((error) => next(error));
        }
    } catch (error) {
        return next(error);
    }
};

export default { login };
