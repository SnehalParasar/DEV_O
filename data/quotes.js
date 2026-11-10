/**
 * In-memory quotes store.
 * Each quote object has: { id, quote, author }
 * No database dependency — all data lives in this module.
 */

let nextId = 6; // next auto-increment id

const quotes = [
  {
    id: 1,
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    id: 2,
    quote: "In the middle of every difficulty lies opportunity.",
    author: "Albert Einstein",
  },
  {
    id: 3,
    quote: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
  },
  {
    id: 4,
    quote: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
  },
  {
    id: 5,
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
];

/**
 * Returns all quotes.
 * @returns {Array}
 */
function getAllQuotes() {
  return quotes;
}

/**
 * Returns a single random quote.
 * @returns {Object}
 */
function getRandomQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}

/**
 * Adds a new quote and returns the created object.
 * @param {string} quote  - The quote text.
 * @param {string} author - The author name.
 * @returns {Object}
 */
function addQuote(quote, author) {
  const newQuote = { id: nextId++, quote, author };
  quotes.push(newQuote);
  return newQuote;
}

module.exports = { getAllQuotes, getRandomQuote, addQuote };
