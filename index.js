// / import http from "http";
// import gfName from "./features.js";

// import { gfName2, gfName3 } from "./features.js";


// console.log(gfName);
// console.log(gfName2);
// console.log(gfName3);

// ab agr sab ko ek sath import krna ho to kaise...neeche
// import http from "http";
// import * as myObj from "./features.js"
// console.log(myObj);


// import { generateLovePercent } from "./features.js";

// import fs from "fs";

// const server = http.createServer((req, res) => {
// console.log(req.url);

// res.end("Noice");
//     // res.end("<h1>Noice</h1>")
//     if(req.url === "/about"){
//         res.end(`<h1>Love is ${generateLovePercent()} </h1>`)
//     }
//     else if(req.url === "/"){
//         res.end(home);
//     }
//     else if(req.url === "/contact"){
//         res.end("<h1>Contact Page</h1>")
//     } else {
//         res.end("<h1> Page Not Found </h1>")
//     } 
// });

// // ab ye upr server to bngya lkin iski jo console log ki value h wo print nhi horhi h to server ko ab hm listen krenge
// server.listen(5000, () => {
//     console.log("server is working");
// })


// ab ye code upr ka kafi mess tha ab hm ise efficient tarike se dekhenge
// Now we will do it from "EXPRESS.JS"


// here we will make a express server
const express = require('express');

const path = require('path');

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
// const { log } = require('console');

mongoose.connect("mongodb://localhost:27017", {
    dbName: "backend",

})
    .then(() => console.log("Database Connected"))
    .catch((e) => console.log(e));


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const User = mongoose.model("User", userSchema);

const app = express();

// this code is fpr google form

// link the public folder 
app.use(express.static(path.join(path.resolve(), "public")));

/ this code is fpr google form/
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// setting up view engine
app.set("view engine", "ejs")

const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    if (token) {

        const decoded = jwt.verify(token, "sdjasdbajsdb");

        req.user = await User.findById(decoded._id);



        next();

    } else {
        res.redirect("/login");
    }
};

// By setting the view engine and views directory, you can easily render EJS templates without specifying the full path each time

// app.get("/", (req, res) => {
// });
// app.get("/", (req, res) => {
//     res.sendStatus(500);
// });
app.get("/", isAuthenticated, (req, res,) => {
    res.render("logout", { name: req.user.name });
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res,) => {
    res.render("register");
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) return res.redirect("/register");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) 
        return res.render("login", { email,  message: "Incorrect Password" })

    const token = jwt.sign({ _id: user._id }, "sdjasdbajsdb");

    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 1000),
    });
    res.redirect("/");


});



app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;


    let user = await User.findOne({ email });
    if (user) {
        return res.redirect("/login");
    }

    const hashedPassword = await bcrypt.hash(password, 10);



    user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    const token = jwt.sign({ _id: user._id }, "sdjasdbajsdb")

    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 1000),
    });
    res.redirect("/");
});
app.get("/logout", (req, res) => {
    res.cookie("token", null, {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.redirect("/");
});

// This code is for google form that we have made

// app.get("/success", (req, res) => {
//     res.render("success")
// });

// app.post("/contact", async (req, res) => {
//     const {name, email} = req.body;
//     await Messge.create({ name ,email});
//     res.redirect("/success");
// });

// app.get("/users", (req, res) => {
//     res.join({
//         users,
//     });
// });


// this code is for authentication




app.listen(5000, () => {
    console.log("Server is working");
});








