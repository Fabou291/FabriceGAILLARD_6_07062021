import userModel from "../models/userModel.js";
import createHttpError from "http-errors";

/**
 * @function create
 * @description Crée un utilisateur et le sauvegarde en bdd
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const create = (req, res, next) => {

    const user = new userModel({
        email: req.body.email,
        password: req.body.password,
        lastLog: new Date().getTime(),
        attempt: 0,
    });

    user.save()
        .then((user) => { res.status(201).json({ message : 'success' }); })
        .catch((error) => {
            const message = error.code && error.code == 11000 ? "Email already used" : error.message;
            res.status(400).json({ message : message })
        });

};



export default { create };
