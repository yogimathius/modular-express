const movieQuotesDb = {
  d9424e04: {
    id: "d9424e04",
    quote: "Why so serious?",
  },
  "27b03e95": {
    id: "27b03e95",
    quote: "YOU SHALL NOT PASS!",
  },
  "5b2cdbcb": {
    id: "5b2cdbcb",
    quote: "It's called a hustle, sweetheart.",
  },
  "917d445c": {
    id: "917d445c",
    quote: "The greatest teacher, failure is.",
  },
  "4ad11feb": {
    id: "4ad11feb",
    quote: "Speak Friend and Enter",
  },
};

const addNewQuote = (content) => {
  // generate an id for the new quote
  const id = Math.random().toString(36).substr(2, 8);

  // {
  //   id: 'd9424e04',
  //   quote: 'Why so serious?',
  // }

  // create a new quote object
  const newQuote = {
    id: id,
    quote: content,
  };

  // Add it to movieQuotesDb
  movieQuotesDb[id] = newQuote;

  // return the id of the quote
  return id;
};

const updateQuote = (id, content) => {
  movieQuotesDb[id].quote = content;
};

module.exports = { movieQuotesDb, addNewQuote, updateQuote };
