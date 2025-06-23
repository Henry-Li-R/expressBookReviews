const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean

}

//only registered users can login
regd_users.post("/login", (req,res) => {
    // empty username and/or password
    const username = (req.body.username || "").trim();
    const password = (req.body.password || "").trim();
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
    //console.log(req.session.authorization);
    return res.send("Login successful!");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const book = books[req.params.isbn]
    if (!book) {
        return res.send(`No book matches with ISBN: ${req.params.isbn}`)
    }
    const username = req.session.authorization.username;
    const review = req.query.review;

    console.log("Before updating reviews: ", book.reviews);

    // below does not update booksdb.js
    // it only modifes books, in memory
    book.reviews = {...book.reviews, [username]: review};

    console.log("After updating reviews: ", book.reviews);

    return res.send("Review updated successfully!");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const book = books[req.params.isbn]
    if (!book) {
        return res.send(`No book matches with ISBN: ${req.params.isbn}`)
    }
    const username = req.session.authorization.username;
    
    console.log("Before updating reviews: ", book.reviews);

    delete book.reviews[username];

    console.log("After updating reviews: ", book.reviews);

    res.send("Review deleted successfully!");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
