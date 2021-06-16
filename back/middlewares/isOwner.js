const sauceModel = require('../models/sauceModel');
const jsonwebtoken = require('jsonwebtoken');
const configGlobal = require('../config/global')

module.exports = (req,res,next) => {
    
    sauceModel.findOne({ _id : req.params.id })
    .then(sauce => {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jsonwebtoken.verify(token, configGlobal.tokenSalt);
        const userId = decodedToken.userId;

        if(!userId == sauce.userId) return res.status(401).json( { message : "Vous n'êtes pas propriétaire de l'article" } );
        next();
    })
    .catch(error => res.status(400).json( { error } ));
}
