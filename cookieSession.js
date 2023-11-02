const cookieSession = require("cookie-session");
const express = require("express");

const app = express();

const cookieSessionConfig = {
  name: "Session",
  keys: ["key1", "key2"],
};

app.use(cookieSession(cookieSessionConfig));

app.get("/", (req, res) => {
  req.session.views = req.session.views + 1 || 0;
  // req.session.views++;

  res.end(req.session.views + " views");
});

app.listen(5000);
