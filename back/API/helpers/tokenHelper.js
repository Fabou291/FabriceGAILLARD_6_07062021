import JWT from "jsonwebtoken";



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
        { expiresIn: "1d" }
    );
};



export default { createToken, createRefreshToken};