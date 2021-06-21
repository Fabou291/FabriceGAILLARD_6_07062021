import JWT from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const isValidToken = (res, req, next) => {
    try {
        const decodedToken = JWT.verify(
            req.headers.authorization.split(" ")[1],
            process.env.SECRET_TOKEN
        );

        if (req.body.userId && req.body.userId !== decodedToken.userId)
            throw "Invalid token";

        next();
    } catch (error) {
        res.status(401).json({ error: error || "Unhautorized" });
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
    JWT.sign(
        { userId: req.body._id }, 
        process.env.SECRET_REFRESH_TOKEN, 
        { expiresIn: "1h" }
    );
    next();
};

export default {  createToken, createRefreshToken};