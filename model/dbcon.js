const mongoose = require("mongoose");

// connect to database
mongoose
    .connect(
        "mongodb+srv://harshsaid558:harshsaid12@cluster0.s0krn.mongodb.net/Cluster0?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => {
        console.log("Connection successfull");
    })
    .catch((err) => console.log(err));