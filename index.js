const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logEvent");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOption");

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
app.use("/employee", require("./routes/api/employee"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts(".html")) {
    res.sendFile(path.join(__dirname, "view", "404.html"));
  }
});

app.listen(3000, () => {
  console.log("server running at 3000");
});
