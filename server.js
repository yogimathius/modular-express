const express = require("express");
const morgan = require("morgan");
// const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;
const SALT_ROUNDS = 10;
const salt = bcrypt.genSaltSync(SALT_ROUNDS);
const cookieSessionConfig = {
  name: "myLoginSession",
  keys: ["my-secret-key"],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

app.use(cookieSession(cookieSessionConfig));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

app.set("view engine", "ejs");

app.listen(PORT, () =>
  console.log(`My fancy server is listening on port: ${PORT}`)
);

// will not persist between server restarts
const users = {
  123: {
    id: "123",
    email: "morty@notRick.com",
    password: "notCats",
  },
  234: {
    id: "234",
    email: "bender@robot.com",
    password: "cigar",
  },
};

const findUserByEmail = (email) => {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
};

app.get("/", (req, res) => {
  console.log("cookies obj =============>", req.session);
  // const user = users[req.cookies.userID];
  const user = users[req.session.userID];
  res.render("index", { user });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  // check if email or password is undefined (the client didn't provide a value)
  if (!email || !password) {
    return res.status(400).send("please provide an email and a password");
  }

  // create a random id
  const id = Math.random().toString(36).substring(2, 5);
  // create a new user object

  const hashedPassword = bcrypt.hashSync(password, salt);

  console.log("hashing password: ", hashedPassword);

  const user = {
    id,
    email,
    password: hashedPassword, // Store our hashed password instead of our plain text!
  };

  // add the new user object to `users`
  users[id] = user;

  console.log("Updated Users after Register:", users);

  // redirect the client to the login page
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  console.log("req.body", req.body);
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send("email and password cannot be blank");
  }

  const user = findUserByEmail(email);
  console.log("user obj", user);

  if (!user) {
    return res.status(400).send("a user with that email does not exist");
  }
  console.log("user password from db: ", user.password);
  console.log("password from login: ", password);

  const isMatch = bcrypt.compareSync(password, user.password);

  if (!isMatch) {
    return res.status(400).send("password does not match");
  }

  // res.cookie("userID", user.id);
  req.session.userID = user.id;
  res.redirect("/");
});

app.get("/protected", (req, res) => {
  // const userID = req.cookies.userID;
  const userID = req.session.userID;
  if (!userID) {
    return res.status(401).send("Unauthorized");
  }

  const foundUser = users[userID];

  if (!foundUser) {
    return res.status(401).send("Invalid Cookie");
  }

  res.render("protected", foundUser);
});

app.post("/logout", (req, res) => {
  // res.clearCookie("userID");
  req.session = null;
  res.redirect("/login");
});
