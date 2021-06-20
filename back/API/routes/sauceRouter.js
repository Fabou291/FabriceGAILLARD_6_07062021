import express from "express";

const router = express.Router();

router.get("/", (req, res, next) => {
  res.end("on GET sauce route /");
});

router.get("/:id", (req, res, next) => {
  res.end("on GET sauce route /:id");
});

router.post("/", (req, res, next) => {
  res.end("on POST sauce route /");
});

router.put("/:id", (req, res, next) => {
  res.end("on PUT sauce route /:id");
});

router.delete("/:id", (req, res, next) => {
  res.end("on DELETE sauce route /:id");
});

router.post("/:id/like", (req, res, next) => {
  res.end("on POST sauce route /:id/like");
});

export default router;
