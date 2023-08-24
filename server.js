const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("view engine", "ejs");

app.listen(PORT, () =>
  console.log(`My fancy server is listening on port: ${PORT}`)
);

// will not persist between server restarts
const users = {
  123: {
    id: "123",
    name: "Morty",
    email: "morty@notRick.com",
    password: "notCats",
  },
  234: {
    id: "234",
    name: "Bender",
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
  res.send("hey im here listening");
});

app.get("/home", (req, res) => {
  console.log("cookies obj =============>", req.cookies);
  // const templateVars =

  res.render("index", { cookies: req.cookies });
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
  const user = {
    id,
    email,
    password, // Store our hashed password instead of our plain text!
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

  if (user.password !== password) {
    return res.status(400).send("password does not match");
  }

  res.cookie("user", { id: user.id, name: user.name });
  res.redirect("/home");
});

app.get("/protected", (req, res) => {
  const user = req.cookies.user;

  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  const foundUser = users[user.id];

  if (!foundUser) {
    return res.status(401).send("Invalid Cookie");
  }

  res.render("protected");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect("/login");
});
