import userModel from "../models/userModel.js";
import authenticationHandler from "../helpers/authenticationHandler.js";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";

const login = async (req, res, next) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) throw createHttpError.NotFound("User not found");

        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPassword) throw createHttpError.Unauthorized("Invalid password");

        res.status(200).json({ userId: user._id, token: authenticationHandler.createToken(user._id) });
    } catch (error) {
        next(error);
    }
};

export default { login };
