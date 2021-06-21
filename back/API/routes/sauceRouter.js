import express from "express";
import sauceController from "../controllers/sauceController.js";
import authenticationHandler from "../helpers/authenticationHandler.js";

const router = express.Router();

router.get("/", sauceController.getAll);

router.get("/:id", sauceController.getOne);

router.post("/", sauceController.create);

router.put("/:id", sauceController.modify);

router.delete("/:id", sauceController.remove);

router.post("/:id/like", sauceController.like);

export default router;
