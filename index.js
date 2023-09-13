const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logEvent");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOption");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

app.use(bodyParser.json());
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "mydatabase",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected");
});

app.post("/data", (req, res) => {
  const { firstname, lastname } = req.body;
  const sql = "INSERT INTO mytable(firstname, lastname) VALUES(?, ?)";
  db.query(sql, [firstname, lastname], (err, result) => {
    if (err) throw err;
    res.send("Table Created");
  });
});

// custom-middleware
app.use(logger);
app.use(cors(corsOptions));
app.use(errorHandler);

// build-in-middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", require("./routes/root"));
app.use("/subdir", require("./routes/subdir"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/employee", require("./routes/api/employee"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts(".html")) {
    res.sendFile(path.join(__dirname, "view", "404.html"));
  }
});

app.listen(5000, () => {
  console.log("server running at 5000");
});
