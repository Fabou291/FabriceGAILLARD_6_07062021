import express from "express";
import userController from "../controllers/userController.js";
import emailMiddleware from "../middlewares/emailMiddleware.js";

const router = express.Router();

router.delete('/', emailMiddleware.encrypt, userController.remove);

export default router;