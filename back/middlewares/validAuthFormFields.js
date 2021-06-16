const passwordValidatorConfig = require('./passwordValidatorConfig');
const emailValidator = require("email-validator");

module.exports = (req,res,next) => {
    if(!passwordValidatorConfig.validate(req.body.password))
        return res.status(400).json({  message : "Le mot de passe que vous avez renseigné n'est pas valide" })

    if(!emailValidator.validate(req.body.email))
        return res.status(400).json({  message : "L'email n'est pas valide'" })    
        
    next();
}
