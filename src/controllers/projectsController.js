const express = require("express");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
    res.status(200).send({ access: true, user: req.userId });
});
module.exports = (app) => app.use("/recover", router);
