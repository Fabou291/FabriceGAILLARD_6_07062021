import userModel from "../models/userModel.js";
import createHttpError from "http-errors";

const create = (req, res, next) => {

    const user = new userModel({
        email: req.body.email,
        password: req.body.password,
        lastLog: new Date().getTime(),
        attempt: 0,
    });

    user.save()
        .then((user) => { res.status(201).json({ user }); })
        .catch((error) => {
            next(createHttpError.BadRequest(
                error.code && error.code == 11000 ? "Email already used" : error.message
            ));
        });
        
};

const remove = (req,res,next) => {
    console.log(req.params.email)
    userModel.deleteOne({email : req.body.email})
    .then(res.status(200).json({ message : "user deleted" }))
    .catch(error => next(error));
}


export default { create,remove };
