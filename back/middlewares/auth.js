const jsonwebtoken = require('jsonwebtoken');
const configGlobal = require('../config/global');

module.exports = (req, res, next) => {
    
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jsonwebtoken.verify(token, configGlobal.tokenSalt);
        const userId = decodedToken.userId;
        if(req.body.userId && req.body.userId !== userId) throw 'User id non valable !';
        next();
    }
    catch(error){
        res.status(401).json( { error : error  ||  'Reqûete non authentifiée !'} );
    }
}