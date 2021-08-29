const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/users.model");
const authConfig = require("../config/auth");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

const generateToken = (params = {}) => {
    return jwt.sign(params, authConfig.secret, {
        //EXPIRA EM 1 DIA:
        expiresIn: 86400,
    });
};

// REGISTRAR NOVO USUÁRIO ========================//
router.post("/register", async (req, res) => {
    try {
        const { email } = req.body;

        if (await User.findOne({ email }))
            return res.status(400).send({ message: "Usuário já existente!" });

        const user = await User.create(req.body);

        //ESCONDE A SENHA NA REQUISIÇÃO:
        user.password = undefined;
        //

        return res.status(200).send({
            message: "Usuário registrado com sucesso!",
            token: generateToken({ id: user.id }),
        });
    } catch (error) {
        return res.status(400).send({
            message: "REGISTRATION FAILED",
        });
    }
});

// AUTENTICAR USUÁRIO ============================//
router.post("/authenticate", async (req, res) => {
    const { email, password } = req.body;

    //O 'select("+password")' habilita o campo password na busca.
    const user = await User.findOne({ email }).select("+password");

    if (!user)
        return res.status(400).send({ message: "Usuário não encontrado" });

    if (!(await bcryptjs.compare(password, user.password)))
        return res.status(400).send({ message: "Senha Inválida" });

    //ESCONDE A SENHA NA REQUISIÇÃO:
    user.password = undefined;
    //

    return res.send({ user, token: generateToken({ id: user.id }) });
});

// ATUALIZAR USUÁRIO ============================//
router.get("/recover", authMiddleware, (req, res) => {
    res.status(200).send({ access: true, user: req.userId });
});

module.exports = (app) => app.use("/auth", router);
