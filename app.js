//jshint esversion:6
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const port = 3000;
const app = express();


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

//mongoose connect
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

//creating the schema for userdatabase
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});



userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
// creating the model by using the userSchema with "User" collections
const User = new mongoose.model("User", userSchema);



app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});


app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save().then(() => {
    res.render("secrets");
  })
    .catch((err) => {
      console.log(err);
    })
});

app.post("/login", function (req, res) {
  const uname = req.body.username;
  const pwd = req.body.password;

  User.findOne({ email: uname }).then(function (foundUser) {
    if (foundUser) {
      if (foundUser.password === pwd) {
        res.render("secrets");
      }else{
        console.log("Wrong Password");
      }
    }
    else{
      console.log("User not found");
    }
  });
})


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});