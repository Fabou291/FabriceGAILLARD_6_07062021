import express from "express";
import userController from "../controllers/userController.js";
import authenticationController from "../controllers/authenticationController.js";
import emailMiddleware from "../middlewares/emailMiddleware.js";
import passwordMiddleware from "../middlewares/passwordMiddleware.js";
import nocache from "nocache"

const router = express.Router();

router.post(
    "/signup",
    nocache(),
    emailMiddleware.checkValidity,
    passwordMiddleware.checkValidity,
    emailMiddleware.encrypt,
    passwordMiddleware.encrypt,
    userController.create
);

router.post(
    "/login",
    nocache(),
    emailMiddleware.checkValidity,
    emailMiddleware.encrypt,
    authenticationController.login
);




export default router;
