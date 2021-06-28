import JWT from "jsonwebtoken";


/**
 * @function createToken
 * @description Crée un token en fonction de l'id de l'utilisateur
 * @param {String} userId 
 * @returns 
 */
const createToken = (userId) => {

    return JWT.sign(
        { userId: userId },
        process.env.SECRET_TOKEN, 
        { expiresIn: "1s" }
    );

};

/**
 * @function createRefreshToken
 * @description Crée un refresh token en fonction de l'id de l'utilisateur
 * @param {String} userId 
 * @returns 
 */
const createRefreshToken = (userId) => {
    return JWT.sign(
        { userId: userId }, 
        process.env.SECRET_REFRESH_TOKEN, 
        { expiresIn: "1d" }
    );
};



export default { createToken, createRefreshToken};