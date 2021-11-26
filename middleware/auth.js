const jwt = require("jsonwebtoken");
const EmpDetails = require("../model/schema");

const auth = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verify = jwt.verify(token, "codefreak.co.in");
        console.log(verify);
        const user = await EmpDetails.findOne({ _id: verify._id });
        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        res.redirect("/");
        console.log("Auth err " + err);
    }
};

module.exports = auth;