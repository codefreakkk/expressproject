const mongoose = require("mongoose");

// connect to database
mongoose
    .connect("mongodb://localhost:27017/expProject", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connection successfull");
    })
    .catch((err) => console.log(err));