//AULA: https://www.youtube.com/watch?v=KKTX1l3sZGk&list=PL85ITvJ7FLoiXVwHXeOsOuVppGbBzo2dp&index=2 20:00

const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.json");

module.exports = (req, res, next) => {
    //PEGA O TOKEN DO HEADER DA REQUISIÇÃO:
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).send({ error: "Token não fornecido" });

    //SEPARA O TOKEN EM DUAS PARTES DENTRO DE UM ARRAY:
    const authParts = authHeader.split(" ");

    if (!authParts.length === 2)
        return res.status(401).send({ error: "Token incompleto" });

    //EXTRAI AS DUAS PARTES DO ARRAY:
    const [schema, token] = authParts;

    //TESTA SE EM SCHEMA ESTÁ ESCRITO "BEARER":
    if (!/^Bearer$/i.test(schema))
        return res.status(401).send({ error: "Token mal formatado" });

    jwt.verify(token, authConfig.secret, (error, decoded) => {
        if (error) return res.status(401).send({ error: "Token invalido" });

        req.userId = decoded.id;
        return next();
    });
};
