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
  // Task 7:
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username: username }, "your_jwt_secret_key", { expiresIn: "1h" });

  req.session.authorization = { token }; 

  return res.status(200).json({ message: "Login successful", token: token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!review) {
    return res.status(400).json({ message: "Review text is required as a query parameter" });
  }

  if (!req.session.authorization || !req.session.authorization.token) {
    return res.status(401).json({ message: "User not logged in" });
  }

  let username;
  try {
    const decoded = jwt.verify(req.session.authorization.token, "your_jwt_secret_key");
    username = decoded.username;
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!book.reviews) {
    book.reviews = {};
  }
  book.reviews[username] = review;

  return res.status(200).json({ message: `Review added/updated for ISBN ${isbn}`, reviews: book.reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Task 9
    const isbn = req.params.isbn;
  
    if (!req.session.authorization || !req.session.authorization.token) {
      return res.status(401).json({ message: "User not logged in" });
    }
  
    let username;
    try {
      const decoded = jwt.verify(req.session.authorization.token, "your_jwt_secret_key");
      username = decoded.username;
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!book.reviews || !book.reviews[username]) {
      return res.status(404).json({ message: "No review found for this user on this book" });
    }
  
    delete book.reviews[username];
  
    return res.status(200).json({ message: `Review deleted for ISBN ${isbn}`, reviews: book.reviews });
  });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
