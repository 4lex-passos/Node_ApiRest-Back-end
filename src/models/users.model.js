const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        //NÂO RETORNA A SENHA EM UMA REQUISIÇÃO:
        select: false,
    },
    createAlt: {
        type: Date,
        default: Date.now,
    },
});

UserSchema.pre("save", async function (next) {
    const hash = await bcryptjs.hash(this.password, 10);
    this.password = hash;

    next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
