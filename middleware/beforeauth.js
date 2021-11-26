const jwt = require("jsonwebtoken");
const EmpDetails = require("../model/schema");

const beforeauth = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verify = jwt.verify(token, "codefreak.co.in");
        // console.log(verify);
        // const user = await EmpDetails.findOne({ _id: verify._id });
        // req.user = user;
        // req.token = token;
        res.redirect("/employee");
    } catch (err) {
        next();
        console.log("Auth err " + err);
    }
};

module.exports = beforeauth;