import express from "express";
import userController from "../controllers/userController.js";
import emailHandler from "../middlewares/emailHandler.js";
import passwordHandler from "../middlewares/passwordHandler.js";

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

export default router;
