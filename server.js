const express = require("express");
const app = express();
require("./model/dbcon");
const EmpDetails = require("./model/schema");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set("view engine", "hbs");

// Route for home page

app.get("/", (req, res) => {
    const flag = req.query.i;
    const update = req.query.u;
    if (flag == "true") {
        res.render("index", {
            registered: "Registration Successfull",
        });
    } else if (flag == "false") {
        res.render("index", {
            registered: "Some error Occured",
        });
    } else if (update == "true") {
        res.render("index", {
            registered: "Data Updated",
        });
    } else if (update == "false") {
        res.render("index", {
            registered: "Data Not Updated",
        });
    } else {
        res.render("index");
    }
});

app.get("/registration", (req, res) => {
    res.render("register");
});

// Route for getting data from user and store into db

app.post("/register", urlencodedParser, async(req, res) => {
    const empName = req.body.uname;
    const empEmail = req.body.email;
    const empNumber = req.body.number;
    const empAge = req.body.age;
    const empAddress = req.body.address;
    const empExperience = req.body.exp + "yr";

    const data = new EmpDetails({
        empName,
        empEmail,
        empNumber,
        empAge,
        empAddress,
        empExperience,
    });

    data.save((err, doc) => {
        if (!err) {
            console.log("Inserted");
            res.redirect("/?i=true");
        } else {
            res.redirect("/?i=false");
        }
    });
});

// Route for employee list
app.get("/employee", async(req, res) => {
    EmpDetails.find((err, data) => {
        if (!err) {
            res.render("employee", {
                empDetails: data,
            });
        } else {
            res.send("Some Error Occured");
        }
    });
});

// Route for updating employees page
app.get("/update/:id", (req, res) => {
    const _id = req.params.id;
    EmpDetails.find({ _id }, (err, data) => {
        if (!err) {
            res.render("updateemp", {
                empD: data,
                empId: _id,
            });
        } else {
            res.send("Some Error Occured");
        }
    });
});

// Route for updating employee
app.post("/uemp", urlencodedParser, (req, res) => {
    const _id = req.body.empId;
    const empName = req.body.uname;
    const empEmail = req.body.email;
    const empNumber = req.body.number;
    const empAge = req.body.age;
    const empAddress = req.body.address;
    const empExperience = req.body.exp;

    console.log(_id);
    EmpDetails.findOneAndUpdate({ _id }, {
            $set: {
                empName: empName,
                empEmail: empEmail,
                empNumber: empNumber,
                empAge: empAge,
                empAddress: empAddress,
                empExperience: empExperience,
            },
        },
        (err, data) => {
            console.log(data);
            if (!err) {
                res.redirect("/?u=true");
            } else {
                res.redirect("/?u=false");
            }
        }
    );
});

// Delete employee
app.get("/delete/:id", (req, res) => {
    const _id = req.params.id;
    EmpDetails.findOneAndDelete({ _id }, (err, data) => {
        if (!err) {
            res.redirect("/");
        } else {
            res.send("Some Error Occured");
        }
    });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("listening");
});