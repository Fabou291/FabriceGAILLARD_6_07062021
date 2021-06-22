import JWT from "jsonwebtoken";
import createHttpError from "http-errors";
import authenticationHandler from "../helpers/authenticationHandler.js";

import dotenv from "dotenv";
dotenv.config();

const isValidToken = (req, tokenParams) => {
    try {
        if (!req.headers.authorization) return false;

        const decodedToken = JWT.verify(...tokenParams);

        if (req.body.userId && req.body.userId !== decodedToken.userId)
            return false;
    } catch (err) {
        if (err && err.name == "TokenExpiredError") return "expired";
        else return false;
    }

    return true;
};

const resetTokens = (userId) => {
    console.log('reset auth')
    return {
        token: JWT.sign(
            { userId: userId },
            process.env.SECRET_TOKEN, 
            { expiresIn: "1h" }
        ),
        refreshToken: JWT.sign(
            { userId: userId },
            process.env.SECRET_REFRESH_TOKEN, 
            { expiresIn: "1y" }
        ),
    };
};



export default (req, res, next) => {
    /*const tokenParams = [
        req.headers.authorization.split(" ")[1],
        process.env.SECRET_TOKEN,
    ];
    const refreshTokenParams = [
        req.cookies.refreshToken,
        process.env.SECRET_REFRESH_TOKEN,
    ];

    let tokenToDecode = req.headers.authorization.split(" ")[1];

    const tokenIsValid = isValidToken(req, tokenParams);
    if (tokenIsValid === false)
        return res.status(401).json({ message: "1 - Invalid token" });

    if (tokenIsValid === "expired") {

        tokenToDecode = req.cookies.refreshToken;

        if (isValidToken(req, refreshTokenParams) === false || "")
            return res.status(401).json({ message: "2 - Invalid token" });
        else {
            const pairToken = resetTokens(req.body.userId);
            tokenToDecode = pairToken.token;
            res.cookie("refreshToken", pairToken.refreshToken);
        }
    }*/

    next();
};
