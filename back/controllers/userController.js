const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

exports.signup = (req, res, next) => {

    bcrypt.hash(req.body.password,10)
    .then(hash => {
        const user = new userModel({
            email : req.body.email,
            password : hash
        });

        user.save()
        .then( user => res.status(201).json(user) )
        .catch(error => res.status(400).json({ error }));        
    })
    .catch(error => res.status(500).json({ error }));



}

exports.login = (req, res, next) => {
   
    userModel.findOne({ email : req.body.email })
    .then( user => {
        if(!user) return res.status(401).json({ message : 'Aucun utilisateur trouvé' });
        
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
           if(!valid) return res.status(401).json({ message : 'Mot de passe incorrect !' })
           res.status(200).json({
               userId : user._id,
               token : jsonwebtoken.sign(
                   { userId : user._id },
                   'dfk{#{`|[^@`sdfgfds~#{{[#|#`dfgxdfg5465^$*ù!ù*dq',
                   { expireIn : '24h' }
               )
           });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }))

}