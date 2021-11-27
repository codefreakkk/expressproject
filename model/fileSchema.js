const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
    empID: String,
    fileURL: String,
});

// creating document
const Files = new mongoose.model("Files", fileSchema);

module.exports = Files;