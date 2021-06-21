import userModel from "../models/userModel.js";
import authenticationHandler from "../helpers/authenticationHandler.js";
import bcrypt from 'bcrypt';
import createError from 'http-errors';

const create = (req, res, next) => {
    const user = new userModel({
        email: req.body.email,
        password: req.body.password,
    });

    user.save()
        .then((user) => {
            authenticationHandler.createToken(user._id);
            res.status(201).json({ user });
        })
        .catch((error) => {
            if (error.code && error.code == 11000)
                error = { message: "Email already used" };
            res.status(400).json({ error });
        });
};

const login = async (req, res, next) => {
    try{
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) throw createError.NotFound('User not found');

        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if(!isValidPassword) throw createError.Unauthorized('Invalid password');

        const token = authenticationHandler.createToken(user._id);
        const refreshToken = authenticationHandler.createRefreshToken(user._id);

        res.cookie('refreshToken', refreshToken)
        res.status(200).json({ user, token, refreshToken })
    }
    catch(error){
        res.status(error.statusCode).json({ error });
    }
};

export default { create, login };
