const express = require("express");
const { getAllQuotes, getRandomQuote, addQuote } = require("./data/quotes");

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(express.json()); // parse JSON request bodies

// ── Routes ──────────────────────────────────────────────────────────────────

/**
 * GET /
 * Welcome message.
 */
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Quote Generator API! 🎉",
    endpoints: {
      "GET /quote":   "Returns a single random quote",
      "GET /quotes":  "Returns all quotes",
      "POST /quotes": "Adds a new quote (body: { quote, author })",
    },
  });
});

/**
 * GET /quote
 * Returns one random quote from the in-memory store.
 */
app.get("/quote", (req, res) => {
  const randomQuote = getRandomQuote();
  res.json(randomQuote);
});

/**
 * GET /quotes
 * Returns the full list of quotes.
 */
app.get("/quotes", (req, res) => {
  res.json(getAllQuotes());
});

/**
 * POST /quotes
 * Adds a new quote. Expects JSON body: { "quote": "...", "author": "..." }
 */
app.post("/quotes", (req, res) => {
  const { quote, author } = req.body;

  // Validate required fields
  if (!quote || typeof quote !== "string" || quote.trim() === "") {
    return res.status(400).json({ error: "Field 'quote' is required and must be a non-empty string." });
  }
  if (!author || typeof author !== "string" || author.trim() === "") {
    return res.status(400).json({ error: "Field 'author' is required and must be a non-empty string." });
  }

  const created = addQuote(quote.trim(), author.trim());
  res.status(201).json(created);
});

/**
 * GET /hello
 * Returns a simple hello message with optional ?name= query param.
 */
app.get("/hello", (req, res) => {
  const name = req.query.name ? req.query.name.trim() : "World";
  res.json({ message: `Hello, ${name}! 👋` });
});

// ── 404 Catch-all ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route '${req.method} ${req.path}' not found.` });
});

module.exports = app; // exported for testing
