import express from "express";

const router = express.Router();

router.post("/login", (req, res, next) => {
    res.end("on POST authentication /login");
});
router.post("/signup", (req, res, next) => {
    res.end("on POST authentication route /signup");
});

export default router;
