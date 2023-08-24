const cookieSession = require("cookie-session");
const express = require("express");

const app = express();

const cookieSessionConfig = {
  name: "myCookieSession",
  keys: ["my-secret-key"],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

app.use(cookieSession(cookieSessionConfig));

app.get("/", (req, res) => {
  // req.session.views = 0;
  // req.session.views++;
  req.session.views = (req.session.views || 0) + 1;
  console.log(req.session);
  res.end(req.session.views + " views");
  // res.end("hello world");
});

app.listen(5555, () => console.log("listening on 5555..."));
