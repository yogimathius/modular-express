const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const quotesRoutes = require("./routes/quotes");
const quotesApiRoutes = require("./routes/quotes-api");

const PORT = process.env.PORT || 3000;

// creating an Express app
const app = express();

// morgan middleware allows to log the request in the terminal
app.use(morgan("short"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Static assets (images, css files) are being served from the public folder
app.use(express.static("public"));

// Setting ejs as the template engine
app.set("view engine", "ejs");

// END POINTS OR ROUTES

app.get("/", (req, res) => {
  res.redirect("/quotes");
});

// VIEW QUOTE PAGES ROUTES
app.use("/quotes", quotesRoutes);

// CRUD ROUTES
app.use("/api/quotes", quotesApiRoutes);

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
