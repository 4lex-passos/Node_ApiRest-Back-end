const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/users.model");
const authConfig = require("../config/auth");

module.exports = {
    authenticateUser: async (req, res) => {
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

        const token = jwt.sign({ id: user.id }, authConfig.secret, {
            //EXPIRA EM 1 DIA:
            expiresIn: 86400,
        });

        return res.send({ user, token });
    },

    createUser: async (req, res) => {
        try {
            const { email } = req.body;

            if (await User.findOne({ email }))
                return res
                    .status(400)
                    .send({ message: "Usuário já existente!" });

            const user = await User.create(req.body);

            //ESCONDE A SENHA NA REQUISIÇÃO:
            user.password = undefined;
            //

            return res.send({ user });
        } catch (error) {
            return res.status(400).send("REGISTRATION FAILED");
        }
    },
};
