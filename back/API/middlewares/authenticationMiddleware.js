import JWT from "jsonwebtoken";
import createHttpError from "http-errors";
import authenticationHandler from "../helpers/authenticationHandler.js";

import userController from "../controllers/userController.js";

import dotenv from "dotenv";
dotenv.config();

const isValidToken = (req, tokenParams) => {
    try {
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
        token : authenticationHandler.createToken(userId),
        refreshToken: authenticationHandler.createRefreshToken(userId),
    };
};



export default (req, res, next) => {
/*
    if(!req.headers.authorization)
        return res.status(401).json({ message: "No token" });

    let tokenToDecode = req.headers.authorization.split(" ")[1];

    const tokenParams = [
        req.headers.authorization.split(" ")[1],
        process.env.SECRET_TOKEN,
    ];
    const refreshTokenParams = [
        JWT.decode(tokenToDecode).userId,
        process.env.SECRET_REFRESH_TOKEN,
    ];

    const tokenIsValid = isValidToken(req, tokenParams);
    if (tokenIsValid === false)
        return res.status(401).json({ message: "1 - Invalid token" });

    if (tokenIsValid === "expired") {

        tokenToDecode = req.cookies.refreshToken;

        if (isValidToken(req, refreshTokenParams) === false || "")
            return res.status(401).json({ message: "2 - Invalid token" });
        else {
            const pairToken = resetTokens( JWT.decode(tokenToDecode).userId );
            userController.refreshToken(JWT.decode(tokenToDecode).userId, pairToken.refreshToken);
        }

    }
*/
    next();
};
