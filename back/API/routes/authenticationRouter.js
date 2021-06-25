import express from "express";
import userController from "../controllers/userController.js";
import authenticationController from "../controllers/authenticationController.js";
import emailMiddleware from "../middlewares/emailMiddleware.js";
import passwordMiddleware from "../middlewares/passwordMiddleware.js";


const router = express.Router();

router.post(
    "/login",
    emailMiddleware.encrypt,
    authenticationController.login
);
router.post(
    "/signup",
    emailMiddleware.checkValidity,
    passwordMiddleware.checkValidity,
    emailMiddleware.encrypt,
    passwordMiddleware.encrypt,
    userController.create
);



export default router;
