import express from "express";
import userController from "../controllers/userController.js";
import emailHandler from "../middlewares/emailHandler.js";
import passwordHandler from "../middlewares/passwordHandler.js";
import authenticationMiddleware from "../middlewares/authenticationMiddleware.js"

const router = express.Router();

router.post(
    "/login",
    emailHandler.encrypt,
    userController.login
);
router.post(
    "/signup",
    emailHandler.parse,
    passwordHandler.parse,
    emailHandler.encrypt,
    passwordHandler.encrypt,
    userController.create
);

router.get("/auth", authenticationMiddleware)

export default router;
