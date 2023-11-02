const express = require("express");
const router = express.Router();
const { movieQuotesDb } = require("../db/quotes");

router.get("/", (req, res) => {
  const movieQuotes = Object.values(movieQuotesDb);

  const templatevars = { movieQuotesArr: movieQuotes };

  res.render("quote_list", { movieQuotesArr: movieQuotes });
});

router.get("/new", (req, res) => {
  res.render("quote_new");
});

router.get("/:id/update", (req, res) => {
  // extract the quote id from the url
  // req.params

  console.log("PARAMS", req.params);

  const quoteId = req.params.id;
  // we to get that quote from the db

  const quoteObj = movieQuotesDb[quoteId];

  const templatevars = { quoteObj: quoteObj };

  // display the update form

  res.render("quote_show", templatevars);
});

module.exports = router;
