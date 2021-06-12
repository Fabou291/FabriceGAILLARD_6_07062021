const userModel = require('../models/userModel');

exports.signup = (req, res, next) => {

    const user = new userModel({
        email : req.body.email,
        password : req.body.password
    });

    user.save()
    .then( () => res.status(201).json({ message : 'Objet enregistré !' }) )
    .catch(error => res.status(400).json({ error }));

}

exports.login = (req, res, next) => {

    userModel.findOne({ email : req.params.email })
    .then( () => res.status(200).json({ message : 'Impossible de trouver !' }) )
    .catch(error => res.status(400).json({ error }))

}