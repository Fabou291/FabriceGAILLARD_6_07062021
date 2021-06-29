import JWT from "jsonwebtoken";
import createHttpError from "http-errors";
import userModel from "../models/userModel.js";



/**
 * @function verifAuthentication
 * @description Vérifie que l'authentification de l'utilisateur est valide
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export default (req, res, next) => {
    try {
        if (!req.headers.authorization) throw createHttpError.Unauthorized("Not Authenticated");

        const accessToken = req.headers.authorization.split(" ")[1];

        JWT.verify(accessToken, process.env.SECRET_TOKEN, (err, decoded) => {
            if (err) {
                if (err.name == "TokenExpiredError") {
                    decoded = JWT.decode(accessToken)
                    userModel
                        .findOne({ _id: decoded.userId })
                        .then((user) => {
                            if(!user) throw createHttpError.Unauthorized("Unauthorized");
                            JWT.verify(user.refreshToken, process.env.SECRET_REFRESH_TOKEN, (err, decoded) => {
                                if(err) throw createHttpError.Unauthorized("Unauthorized");
                                else if (req.userId && req.userId !== decoded.userId) throw createHttpError.Unauthorized("Unauthorized");
                                else {
                                   /**
                                    * Là, devrais être délivré un nouveau token au front, pour qu'il le set
                                    * dans le header authorization, mais le front ne le permet pas pour le moment.
                                    *   tokenHelper.createToken(req.userId)
                                    */
                                   req.authentication = { userId : decoded.userId }
                                   return next(); 
                                }
                            });
                        })
                        .catch((error) => next(error));
                } else return next(err);
            }
            else{
                if (req.userId && req.userId !== decoded.userId) return next(createHttpError.Unauthorized("Unauthorized - 1"));
                else{
                    req.authentication = { userId : decoded.userId }
                    return next();  
                }               
            }
        });
    } catch (error) {
        return next(error);
    }
};
