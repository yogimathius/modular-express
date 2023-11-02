const express = require("express");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");

const app = express();

const saltRounds = 10;

const salt = bcrypt.genSaltSync(saltRounds);

const cookieSessionConfig = {
  name: "Session",
  keys: ["key1", "key2"],
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(cookieSession(cookieSessionConfig));

// Setting up view envine
app.set("view engine", "ejs");

// Simulation of a database
const listOfUsers = {
  "alex@miller.com": {
    firstName: "Alex",
    lastName: "Miller",
    password: "password123",
  },
  "martha@smith.com": {
    firstName: "Martha",
    lastName: "Smith",
    password: "secret1234",
  },
};

// Endpoints
app.get("/registration", (req, res) => {
  return res.render("registration");
});

app.get("/login", (req, res) => {
  return res.render("login");
});

app.get("/home", (req, res) => {
  // if (!req.cookies.firstName) {
  //   console.log("You are not allowed to be here!");
  //   return res.redirect("/login");
  // }

  if (!req.session.firstName) {
    console.log("You are not allowed to be here!");
    return res.redirect("/login");
  }

  const templateVariables = {
    firstName: req.session.firstName,
    lastName: req.session.lastName,
  };
  return res.render("home", templateVariables);
});

app.post("/create/user", (req, res) => {
  // If the user already exists, don't create it again. Send an error message
  if (listOfUsers[req.body.email]) {
    return res.status(400).send(`
                    <h1>The email that you are trying to use already exists!</h1>
                    <a href="/registration"> Go back to registration </a>
                    `);
  }

  const hash = bcrypt.hashSync(req.body.password, salt);

  console.log("hash: ", hash);

  listOfUsers[req.body.email] = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: hash,
  };

  req.session.firstName = req.body.firstName;
  req.session.lastName = req.body.lastName;

  // Redirect to home page
  return res.redirect("/home");
});

app.post("/process/login", (req, res) => {
  // Validate if email exists in the listOfUsers
  if (!listOfUsers[req.body.email]) {
    return res.send("<h1>This user doesn't exist!</h1>");
  }
  console.log(req.body.password);
  console.log(listOfUsers[req.body.email].password);
  // Validate that the passwords match

  const passwordMatches = bcrypt.compareSync(
    req.body.password,
    listOfUsers[req.body.email].password
  );

  if (!passwordMatches) {
    return res.send("<h1>Wrong credentials</h1>");
  }

  req.session.firstName = listOfUsers[req.body.email].firstName;
  req.session.lastName = listOfUsers[req.body.email].lastName;

  return res.redirect("/home");
});

app.post("/logout", (req, res) => {
  req.session = null;
  return res.redirect("/login");
});

app.listen(8080, () => {
  console.log("Server running in port 8080");
});
