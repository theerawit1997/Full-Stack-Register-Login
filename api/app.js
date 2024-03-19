var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

app.use(cors());

const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root2",
  database: "mydb",
});

app.post("/register", jsonParser, function (req, res, next) {
  connection.execute(
    "INSERT INTO users (email, password, fname, lname) VALUES (?, ?, ?, ?)",
    [req.body.email, req.body.password, req.body.fname, req.body.lname],
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

app.listen(4000, function () {
  console.log("CORS-enabled web server listening on port 4000");
});
