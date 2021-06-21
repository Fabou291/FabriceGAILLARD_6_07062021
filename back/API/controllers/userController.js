import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import authenticationHandler from '../helpers/authenticationHandler.js';


const create = (req, res, next) => {
    authenticationHandler.createToken('iodfjsfjh')
    res.send(req.body);
};

const login = (req, res, next) => {
    res.end("login functionnality");
};

export default { create, login };
