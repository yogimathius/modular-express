const express = require("express");
const router = express.Router();
const { movieQuotesDb, updateQuote, addNewQuote } = require("../db/quotes");

router.post("/", (req, res) => {
  // Extract the information contained in the form
  // req.body

  console.log(req.body);
  // {quote_content: 'Over My Dead Body'}

  const content = req.body["quote_content"];

  console.log("CONTENT", content);

  // Create a new quote in the db
  const quoteId = addNewQuote(content);

  // redirect to /quotes
  res.redirect("/");

  // res.send("Quote added");
});

router.post("/:id", (req, res) => {
  // Extract the quote id from the url
  // req.params

  const quoteId = req.params.id;

  // Extract the quote content from the form
  // req.body

  const content = req.body.quote_content;

  // Update the quote in the db

  updateQuote(quoteId, content);

  // redirect to /quotes

  res.redirect("/quotes");
});

// delete a quote from the DB - DELETE (POST)
router.post("/:id/delete", (req, res) => {
  console.log("DELETE HERE");

  // extract the id from the url
  // req.params
  const quoteId = req.params.id;
  // delete it from the db
  delete movieQuotesDb[quoteId];

  // redirect to /quotes
  res.redirect("/quotes");
});

module.exports = router;
