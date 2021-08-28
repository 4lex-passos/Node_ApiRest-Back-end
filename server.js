const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

app.use(cors());

app.use(express.json());

try {
    mongoose.connect(
        "mongodb+srv://yomare28:929790123@cluster0.vcofd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    );
    console.log("Connected to the database!");
} catch (error) {
    console.log("Cannot connect to the database!".toUpperCase, error);
}

mongoose.Promise = global.Promise;

app.use(require("./src/routes/users.routes"));

var PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`SERVIDOR RODANDO NA PORTA: ${PORT}.`);
});

module.exports = app;
