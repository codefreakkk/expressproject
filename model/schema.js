const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const schema = new mongoose.Schema({
    empName: String,
    empEmail: String,
    empPass: String,
    empAge: String,
    empAddress: String,
    empExperience: String,
    tokens: [{
        token: {
            type: String,
        },
    }, ],
});

// middleware for generating tokens
schema.methods.generateToken = async function() {
    try {
        const _id = this._id;
        const token = await jwt.sign({ _id }, "codefreak.co.in");
        this.tokens = this.tokens.concat({ token });
        await this.save();
        return token;
    } catch (err) {
        console.log("Token generation err " + err);
    }
};

const EmpDetails = new mongoose.model("EmpDetails", schema);

module.exports = EmpDetails;