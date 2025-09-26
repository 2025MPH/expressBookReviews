const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 10: 
public_users.get('/async-books', async function (req, res) {
    try {
      const response = await new Promise((resolve) => {
        resolve({ data: books });
      });
  
      return res.send(JSON.stringify(response.data, null, 4));
    } 
    catch (err) {
      return res.status(500).json({ message: "Error fetching books" });
    }
  });

// Task 11:
public_users.get('/isbn-promise/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve({ data: book });
      } else {
        reject({ message: "Book not found" });
      }
    })
      .then((response) => {
        res.send(JSON.stringify(response.data, null, 4));
      })
      .catch((error) => {
        res.status(404).json({ message: error.message });
      });
  });

// Task 12:
public_users.get('/author-async/:author', async function (req, res) {
    try {
      const author = req.params.author.toLowerCase();
  
      const response = await new Promise((resolve) => {
        const matchingBooks = Object.keys(books)
          .filter((key) => books[key].author && books[key].author.toLowerCase() === author)
          .map((key) => books[key]);
        resolve({ data: matchingBooks });
      });
  
      if (response.data.length > 0) {
        return res.send(JSON.stringify(response.data, null, 4));
      } else {
        return res.status(404).json({ message: "No books found for this author" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Error fetching books by author" });
    }
  });

// Task 13:
public_users.get('/title-promise/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
  
    new Promise((resolve, reject) => {
      const matchingBooks = Object.keys(books)
        .filter((key) => books[key].title && books[key].title.toLowerCase() === title)
        .map((key) => books[key]);
  
      if (matchingBooks.length > 0) {
        resolve({ data: matchingBooks });
      } else {
        reject({ message: "No books found with this title" });
      }
    })
      .then((response) => {
        res.send(JSON.stringify(response.data, null, 4));
      })
      .catch((error) => {
        res.status(404).json({ message: error.message });
      });
  });

public_users.post("/register", (req,res) => {
  //Task 6:
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.find((user) => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username: username, password: password });

  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Task 1: Return all books as a pretty JSON string
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // Task 2: Get ISBN from request parameters
  const isbn = req.params.isbn;

  // Look up the book in the books object
  const book = books[isbn];

  if (book) {
    return res.send(JSON.stringify(book, null, 4));
  }

  return res.status(404).json({ message: "Book not found" });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Task 3:

  const author = req.params.author.toLowerCase();

  // Collect all books where author matches
  let matchingBooks = [];

  let keys = Object.keys(books);
  keys.forEach((key) => {
    if (books[key].author && books[key].author.toLowerCase() === author) {
      matchingBooks.push(books[key]);
    }
  });

  if (matchingBooks.length > 0) {
    return res.send(JSON.stringify(matchingBooks, null, 4));
  }

  return res.status(404).json({ message: "No books found" });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // Task 4:
  const title = req.params.title.toLowerCase();

  // Collect all books where title matches
  let matchingBooks = [];
  let keys = Object.keys(books);

  keys.forEach((key) => {
    if (books[key].title && books[key].title.toLowerCase() === title) {
      matchingBooks.push(books[key]);
    }
  });

  if (matchingBooks.length > 0) {
    return res.send(JSON.stringify(matchingBooks, null, 4));
  }
  return res.status(404).json({ message: "No books found with this title" });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Task 5:
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.send(JSON.stringify(book.reviews || {}, null, 4));
  }

  return res.status(404).json({ message: "Book not found" });
});
module.exports.general = public_users;

