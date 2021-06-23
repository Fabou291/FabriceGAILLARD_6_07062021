import express from "express";
import userController from "../controllers/userController.js";
import authenticationController from "../controllers/authenticationController.js";
import emailHandler from "../middlewares/emailHandler.js";
import passwordHandler from "../middlewares/passwordHandler.js";
import authenticationMiddleware from "../middlewares/authenticationMiddleware.js"

const router = express.Router();

router.post(
    "/login",
    emailHandler.encrypt,
    authenticationController.login
);
router.post(
    "/signup",
    emailHandler.checkValidity,
    passwordHandler.checkValidity,
    emailHandler.encrypt,
    passwordHandler.encrypt,
    userController.create
);



export default router;
