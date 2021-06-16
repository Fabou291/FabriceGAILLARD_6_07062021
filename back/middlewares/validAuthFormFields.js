const passwordValidatorConfig = require('./passwordValidatorConfig');
const emailValidator = require("email-validator");

module.exports = (req,res,next) => {
    const listOfFailed = passwordValidatorConfig.validate(req.body.password, {list : true});
    if(listOfFailed.length > 0)
        return res.status(400).json({  message : "Le mot de passe que vous avez renseigné n'est pas valide, les tests suivant ont été échoué : " + listOfFailed.join() })

    if(!emailValidator.validate(req.body.email))
        return res.status(400).json({  message : "L'email n'est pas valide'" })    
        
    next();
}
