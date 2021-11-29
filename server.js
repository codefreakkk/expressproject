const express = require("express");
const app = express();
require("./model/dbcon");
const auth = require("./middleware/auth");
const beforeauth = require("./middleware/beforeauth");
const EmpDetails = require("./model/schema");
const Files = require("./model/fileSchema");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jwt = require("jsonwebtoken");
const path = require("path");
const hbs = require("hbs");
let cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const partialsPath = path.join(__dirname, "./partials");

app.use(cookieParser());
app.set("view engine", "hbs");
app.use(fileUpload());
hbs.registerPartials("partials", partialsPath);

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

// Route for rendering registeration page
app.get("/registration", beforeauth, (req, res) => {
    res.render("register");
});

// Route for getting data from user and store into db
app.post("/register", urlencodedParser, async(req, res) => {
    const empName = req.body.uname;
    const empEmail = req.body.email;
    const empPass = req.body.pass;
    const empAddress = req.body.address;
    const empExperience = req.body.exp + "yr";

    const data = new EmpDetails({
        empName,
        empEmail,
        empPass,
        empAddress,
        empExperience,
    });

    const token = await data.generateToken();
    // console.log(token);

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
app.get("/employee", auth, (req, res) => {
    try {
        const token = req.cookies.jwt;
        EmpDetails.find((err, data) => {
            if (!err) {
                res.render("employee", {
                    empDetails: data,
                    usertoken: token,
                });
            } else {
                res.send("Some Error Occured");
            }
        });
    } catch (err) {
        res.send("Err" + err);
    }
});

// Route for updating employees page
app.get("/update/:id", auth, (req, res) => {
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
app.post("/uemp", urlencodedParser, auth, (req, res) => {
    const _id = req.body.empId;
    const empName = req.body.uname;
    const empEmail = req.body.email;
    const empPass = req.body.pass;
    const empAddress = req.body.address;
    const empExperience = req.body.exp;

    EmpDetails.findOneAndUpdate({ _id }, {
            $set: {
                empName: empName,
                empEmail: empEmail,
                empPass: empPass,
                empAddress: empAddress,
                empExperience: empExperience,
            },
        },
        (err, data) => {
            // console.log(data);
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

// Route for file uploading
app.get("/upload", auth, (req, res) => {
    res.render("uploadfile");
});

// Route for uploading file into db
app.post("/uploadfile", auth, (req, res) => {
    if (!req.files) {
        // if file upload fails
        res.render("uploadfile", {
            errormsg: "File Not Uploaded",
        });
    } else {
        const file = req.files.myfile;
        const filen = req.body.filename;
        const fileSize = file.size;
        const allowedSize = 30000000;
        const extension = path.extname(file.name);
        file.name =
            "file" + Date.now() + Math.floor(Math.random() * 100) + extension;
        const uploadPath = path.join(__dirname, "/uploads", `/${file.name}`);
        // move file to upload folder
        if (fileSize < allowedSize) {
            file.mv(uploadPath, (err) => {
                if (err) return res.status(500).send("File Not Uploaded");
                const id = req.user._id.toString();
                const data = new Files({
                    empID: id,
                    fileURL: `uploads/${file.name}`,
                    fileName: filen,
                });
                data.save(data, (err, data) => {
                    if (err) {
                        console.log("Not inserted");
                        res.send("Data Not Inserted");
                    } else {
                        console.log("Inserted");
                        res.redirect("/?u=true");
                    }
                });
            });
        } else {
            res.send("Your file should be less than 30MB");
            console.log("file size exceded");
        }
    }
});

// Route for displaying users file
app.get("/myfiles", auth, (req, res) => {
    try {
        const id = req.user._id.toString();

        Files.find({ empID: id }, (err, data) => {
            if (!err) {
                if (data.length > 0) {
                    res.render("myfiles", {
                        data: data,
                    });
                } else {
                    res.render("myfiles");
                }
            } else {
                res.send("Error in Fetching file from Server");
            }
        });
    } catch (err) {
        res.send("Some Error Occured My Space Section");
    }
});

app.get("/download/:fileid", auth, (req, res) => {
    const fileid = req.params.fileid;
    Files.findOne({ _id: fileid }, (err, data) => {
        if (!err) {
            res.download(data.fileURL);
        } else {
            res.send("Some Error occured");
        }
    });
});

// Render login page
app.get("/login", beforeauth, (req, res) => {
    const flag = req.query.incorrect;
    if (flag == "true") {
        res.render("login", {
            alert: true,
        });
    } else {
        res.render("login");
    }
});

// Route for login system
app.post("/securelogin", urlencodedParser, async(req, res) => {
    try {
        const empEmail = req.body.email;
        const pass = req.body.password;

        const data = await EmpDetails.findOne({ empEmail });

        if (data.empPass == pass) {
            const token = await data.generateToken();
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 5000000),
            });
            res.redirect("/myfiles");
            console.log("Logged in");
        } else {
            console.log("Pass incorrect");
            res.redirect("/login?incorrect=true");
        }
    } catch (err) {
        res.redirect("/login?incorrect=true");
    }
});

// logout functionality
app.get("/logout", auth, async(req, res) => {
    try {
        res.clearCookie("jwt");
        // delete auth token from db
        req.user.tokens = req.user.tokens.filter((data) => data.token != req.token);
        await req.user.save();
        res.redirect("/");
        console.log("logged out");
    } catch (err) {
        console.log(err);
        res.send("Logout Error");
    }
});

// port
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("Listening at port " + port);
});