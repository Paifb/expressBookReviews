
const express = require('express');
const books = require("./booksdb.js");
const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Please provide username and password"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists!"
    });
  }

  users.push({ username, password });

  return res.status(200).json({
    message: "User successfully registered. Now you can login"
  });
});

// Get all books
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

// Get book details by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  return res.status(200).json(book);
});

// Get books by author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();

  const results = Object.fromEntries(
    Object.entries(books).filter(([isbn, book]) =>
      book.author.toLowerCase().includes(author)
    )
  );

  return res.status(200).json(results);
});

// Get books by title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();

  const results = Object.fromEntries(
    Object.entries(books).filter(([isbn, book]) =>
      book.title.toLowerCase().includes(title)
    )
  );

  return res.status(200).json(results);
});

// Get book reviews by ISBN
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
