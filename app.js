require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

//SCHEMA
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// encryption

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

//MODEL
const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  // DOC
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(e){
    if (e){
      console.log(e);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

User.findOne({email: username}, function(e, foundUser){
  if (e) {
    console.log(e);
  } else {
    if (foundUser) {
      if (foundUser.password === password) {
        res.render("secrets");
      }
    }
  }
});

});

app.listen(3000, function(){
  console.log("shhhhhhhhh");
});
