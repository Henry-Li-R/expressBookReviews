const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    // empty username and/or password
    const username = req.body.username.trim();
    const password = req.body.password.trim();
    if (username === "" || password === "") {
        return res.send("Username and password must not be blank");
    }

    // username does not exist
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.send("Invalid username. Please register first if you are a new user");
    }

    // password does not match
    if (password !== user.password) {
        return res.send("Invalid password. Please try again.");
    }

    // valid login
    let accessToken = jwt.sign({username}, "access", {expiresIn: 60*60});
    req.session.authorization = {accessToken, username};
    return res.send("Login successful!");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
