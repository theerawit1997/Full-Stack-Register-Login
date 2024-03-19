var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const bcrypt = require("bcrypt");
const saltRounds = 10;

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

app.listen(4000, function () {
  console.log("CORS-enabled web server listening on port 4000");
});
