import JWT from "jsonwebtoken";
import createHttpError from "http-errors";

import dotenv from "dotenv";
dotenv.config();

const isValidToken = (token) => {
    if(!token)
        throw createHttpError.Unauthorized("Invalid token");

        const decodedToken = JWT.verify(
            req.headers.authorization.split(" ")[1],
            process.env.SECRET_TOKEN
        );
        
    return decodedToken;
}

const createToken = (userId) => {

    return JWT.sign(
        { userId: userId },
        process.env.SECRET_TOKEN, 
        { expiresIn: "1s" }
    );

};

const createRefreshToken = (userId) => {
    return JWT.sign(
        { userId: userId }, 
        process.env.SECRET_REFRESH_TOKEN, 
        { expiresIn: "1y" }
    );
};

export default { isValidToken, createToken, createRefreshToken};