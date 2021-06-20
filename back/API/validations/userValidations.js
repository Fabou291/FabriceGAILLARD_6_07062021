import passwordValidator from "password-validator";
import emailValidator from "email-validator";

const isAValidPassword = (password) => {
    const schema = new passwordValidator();
 
    schema
    .is().min(8)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123']);
    
    return schema.validate(password);
}

const isAValidEmail = (email) => {
    return emailValidator.validate(email)
}

export default { isAValidPassword, isAValidEmail };