const express = require("express");
const auth = require("../middlewares/auth");

const router = express.Router();

const users = require("../controllers/users.controller");

router.post("/authenticate", auth, users.authenticateUser);

router.post("/users", users.createUser);

module.exports = router;
