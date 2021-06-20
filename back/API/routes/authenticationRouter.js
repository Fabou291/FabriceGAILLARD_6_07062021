import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

router.post("/login", userController.create);
router.post("/signup", userController.login);

export default router;
