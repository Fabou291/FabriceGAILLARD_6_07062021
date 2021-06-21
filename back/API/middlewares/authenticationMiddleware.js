import JWT from "jsonwebtoken";
import createHttpError from "http-errors";
import authenticationHandler from "../helpers/authenticationHandler.js";

import dotenv from "dotenv";
dotenv.config();

const isValidToken = (req, tokenParams) => {
    try {
        if (!req.headers.authorization) return false;

        const decodedToken = JWT.verify(...tokenParams);

        if (
            !decodedToken ||
            (req.body.userId && req.body.userId !== decodedToken.userId)
        )
            return false;
    } catch (err) {
        if (err && err.name == "TokenExpiredError") return "expired";
        else return false;
    }

    return true;
};

const refreshAll = (res) => {
    authenticationHandler.createToken();
    res.cookie("refreshToken", authenticationHandler.createRefreshToken());
};



export default (req, res, next) => {

    const tokenParams = [
        req.headers.authorization.split(" ")[1],
        process.env.SECRET_TOKEN,
    ];
    const refreshTokenParams = [
        req.cookies.refreshToken,
        process.env.SECRET_REFRESH_TOKEN,
    ];

    const tokenIsValid = isValidToken(req, tokenParams);

    if (tokenIsValid === false) return res.status(401).json({ message : 'Invalid token' });
    else if (tokenIsValid === "expired") {
        const refreshTokenIsValid = isValidToken(req, refreshTokenParams);

        if (refreshTokenIsValid !== true) return res.status(401).json({ message : 'Invalid token' });
        else refreshAll(res);
    }

    next();


};
