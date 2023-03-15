const express = require("express");
//const morgan = require("morgan");
const app = express();

const { quotes } = require("./data");
const { getRandomElement } = require("./utils");

const PORT = process.env.PORT || 4001;
app.get("/api/quotes/random", (req, res) => {
  const quote = getRandomElement(quotes);
  res.send({ quote });
});

// Route to return all quotes or quotes by a specific person
app.get("/api/quotes", (req, res) => {
  const { person } = req.query;
  let requestedQuotes = quotes;

  if (person) {
    requestedQuotes = quotes.filter(
      (quote) => quote.person.toLowerCase() === person.toLowerCase()
    );
  }

  res.send({ quotes: requestedQuotes });
});

app.post("/api/quotes", (req, res) => {
  const { quote, person } = req.query;
  const newQuote = {
    id: quotes.length + 1, // generate a unique ID for the new quote
    quote,
    person,
  };

  if (!quote || !person) {
    return res.status(400).send("Both quote and person are required");
  } else {
    quotes.push(newQuote);
    res.send({ quote: newQuote });
  }
});

app.delete("/api/quotes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = quotes.findIndex((quote) => quote.id === id);

  if (index !== -1) {
    quotes.splice(index, 1);
    res.send(`Quote with ID ${id} successfully deleted`);
  } else {
    res.status(404).send(`Quote with ID ${id} not found`);
  }
});

app.listen(PORT);

app.use(express.static("public"));
