const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    empName: String,
    empEmail: String,
    empNumber: String,
    empAge: String,
    empAddress: String,
    empExperience: String,
});

const EmpDetails = new mongoose.model("EmpDetails", schema);

module.exports = EmpDetails;