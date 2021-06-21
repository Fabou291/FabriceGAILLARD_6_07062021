import JWT from "jsonwebtoken";
import createHttpError from "http-errors";

import dotenv from "dotenv";
dotenv.config();

const parseToken = (req, res, next) => {
    try {
        if(!req.headers.authorization)
            throw createHttpError.Unauthorized("Invalid token");

        const decodedToken = JWT.verify(
            req.headers.authorization.split(" ")[1],
            process.env.SECRET_TOKEN
        );
        
        if (req.body.userId && req.body.userId !== decodedToken.userId)
            throw createHttpError.Unauthorized("Invalid token");

        next();
    } catch (error) {
        if(error.name && error.name == "TokenExpiredError") {
            /////console.log(req.cookies)
        }

        if(!error.statusCode) error.statusCode = 500;
        if(error.name && error.name == "JsonWebTokenError") error.statusCode = 401;
        res.status(error.statusCode).json({ error });
    }
};

const createToken = (userId) => {

    return JWT.sign(
        { userId: userId },
        process.env.SECRET_TOKEN, 
        {expiresIn: "1h"}
    );

};

const createRefreshToken = (userId) => {
    return JWT.sign(
        { userId: userId }, 
        process.env.SECRET_REFRESH_TOKEN, 
        { expiresIn: "1y" }
    );
};

export default { parseToken, createToken, createRefreshToken};