import JWT from "jsonwebtoken";
import createHttpError from "http-errors";
import authenticationHandler from "../helpers/authenticationHandler.js";

import dotenv from "dotenv";
dotenv.config();

const parseRefreshToken = (req, res) => {
    console.log('yo2')
    const error = createHttpError.Unauthorized("Invalid Token");

    if (!req.cookies || !req.cookies.refreshToken) return error;

    try {
        const decodedToken = JWT.verify(
            req.cookies.refreshToken,
            process.env.SECRET_REFRESH_TOKEN
        );
    } catch (err) {
        return error;
    }

    if (req.body.userId && req.body.userId !== decodedToken.userId)
        return error;

    const token = authenticationHandler.createToken();
    const refreshToken = authenticationHandler.createRefreshToken();
    res.cookie("refreshToken", refreshToken);

    return;
};

const parseToken = (req, res) => {
    const error = createHttpError.Unauthorized("Invalid Token");

    if (!req.headers.authorization) return error;

    try {
        const decodedToken = JWT.verify(
            req.headers.authorization.split(" ")[1],
            process.env.SECRET_TOKEN
        );
    } catch (err) {
        if (err && err.name == "TokenExpiredError")
            return parseRefreshToken(req, res);
        else return error;
    }

    if (
        !decodedToken ||
        (req.body.userId && req.body.userId !== decodedToken.userId)
    )
        return error;

    return;
};

export default (req, res, next) => {
    const error = parseToken(req, res);
    if (error) res.status(error.statusCode).json({ error: error.message });
    else next();
};

