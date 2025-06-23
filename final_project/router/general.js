const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    // empty username and/or password
    const username = req.body.username.trim();
    const password = req.body.password.trim();
    if (username === "" || password === "") {
        return res.send("Username and password must not be blank");
    }
    
    // username already used
    if (users.some(user => user.username === username)) {
        return res.send("The username already exists");
    }

    // valid registration
    users.push({"username": username, "password": password});
    return res.send("Registration successful!");
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const book = books[req.params.isbn]
    if (!book) {
        return res.send(`No book matches with ISBN: ${req.params.isbn}`)
    }
    return res.send(JSON.stringify(book, null, 4));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const selectedBookKeys = Object.keys(books).filter(key =>
        books[key]["author"] === author);
    let selectedBooks = {};
    selectedBookKeys.forEach(key => {
        selectedBooks = { ...selectedBooks, [key]: books[key] }
    });

    if (selectedBookKeys.length == 0) {
        return res.send(`No books available by author: ${author}`);
    }
    res.send(JSON.stringify(selectedBooks, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const selectedBookKeys = Object.keys(books).filter(key =>
        books[key]["title"] === title);
    let selectedBooks = {};
    selectedBookKeys.forEach(key => {
        selectedBooks = { ...selectedBooks, [key]: books[key] }
    });

    if (selectedBookKeys.length == 0) {
        return res.send(`No books available with title: ${title}`);
    }
    res.send(JSON.stringify(selectedBooks, null, 4));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (!books[isbn]) {
        return res.send(`No book matches with ISBN: ${req.params.isbn}`);
    }
    const reviews = books[isbn]["reviews"];
    if (Object.keys(reviews).length == 0) {
        return res.send("No reviews yet");
    }
    return res.send(JSON.stringify(reviews, null, 4));
});

module.exports.general = public_users;
