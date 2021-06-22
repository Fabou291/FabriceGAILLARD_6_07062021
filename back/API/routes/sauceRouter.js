import express from "express";
import sauceController from "../controllers/sauceController.js";
import auth from "../middlewares/authenticationMiddleware.js";
import multerConfig from "../middlewares/multerConfig.js";

const router = express.Router();

router.get("/", auth, sauceController.getAll);

router.get("/:id", auth, sauceController.getOne);

router.post("/", auth, multerConfig, sauceController.create);

router.put("/:id", auth, sauceController.modify);

router.delete("/:id", auth, sauceController.remove);

router.post("/:id/like", auth, sauceController.like);

export default router;
