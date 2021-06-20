import express from "express";
import userController from "../controllers/userController.js";
import emailHandler from "../middlewares/emailHandler.js";

const router = express.Router();

router.post(
    "/login",
    userController.create
);
router.post(
    "/signup",
    emailHandler.parse,
    emailHandler.encrypt,
    userController.create
);

export default router;
