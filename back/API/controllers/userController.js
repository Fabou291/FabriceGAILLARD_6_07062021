import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';


const create = (req, res, next) => {
    
    res.send(req.body);
};

const login = (req, res, next) => {
    res.end("login functionnality");
};

export default { create, login };
