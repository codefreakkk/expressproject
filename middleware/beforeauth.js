const jwt = require("jsonwebtoken");
const EmpDetails = require("../model/schema");

const beforeauth = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verify = jwt.verify(token, "codefreak.co.in");
        res.redirect("/myfiles");
    } catch (err) {
        next();
        console.log("Auth err " + err);
    }
};

module.exports = beforeauth;