var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require("jsonwebtoken");
const secret = "man-1997";

app.use(cors());

const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root2",
  database: "mydb",
});

app.post("/register", jsonParser, function (req, res, next) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    connection.execute(
      "INSERT INTO users (email, password, fname, lname) VALUES (?, ?, ?, ?)",
      [req.body.email, hash, req.body.fname, req.body.lname],
      function (err, results, fields) {
        if (err) {
          // res.json({ status: "error", message: err });
          res.json({ status: "error", message: err.message });
          return;
        }
        res.json({ status: "success" });
      }
    );
  });
});

app.post("/login", jsonParser, function (req, res, next) {
  connection.execute(
    "SELECT * FROM users WHERE email = ?",
    [req.body.email],
    function (err, user, fields) {
      if (err) {
        res.json({ status: "error", message: err.message });
        return;
      }
      if (user.length == 0) {
        res.json({ status: "error", message: "Invalid email" });
        return;
      }
      // Load hash from your password DB.
      bcrypt.compare(
        req.body.password,
        user[0].password,
        function (err, LoginHash) {
          if (LoginHash) {
            var token = jwt.sign({ email: user[0].email }, secret, {
              expiresIn: "1h",
            });
            res.json({
              status: "success",
              message: "Login success",
              token: token,
              expiresIn: "1h",
            });
          } else {
            res.json({ status: "error", message: "Invalid password" });
          }
        }
      );
    }
  );
});

app.listen(4000, function () {
  console.log("CORS-enabled web server listening on port 4000");
});
