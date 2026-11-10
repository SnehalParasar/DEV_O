# Quote Generator API

A lightweight, zero-database REST API built with **Node.js + Express** that serves an in-memory collection of quotes.

## Project Structure

```
devops/
├── app.js              # Express app & route definitions (exported for testing)
├── server.js           # Entry point — starts the HTTP server
├── data/
│   └── quotes.js       # In-memory store + CRUD helper functions
├── __tests__/
│   └── api.test.js     # Jest + Supertest integration tests
└── package.json
```

## Getting Started

### Install dependencies
```bash
npm install
```

### Run the server
```bash
npm start          # production
npm run dev        # auto-restart on file changes (Node ≥ 18)
```

The API will be available at `http://localhost:3000`.

### Run tests
```bash
npm test
```

---

## API Reference

| Method | Path       | Description                              |
|--------|------------|------------------------------------------|
| GET    | `/`        | Welcome message + endpoint listing       |
| GET    | `/quote`   | Returns a **single random** quote        |
| GET    | `/quotes`  | Returns the **full list** of quotes      |
| POST   | `/quotes`  | Adds a new quote                         |

### POST `/quotes` — Request body
```json
{
  "quote": "Your quote text here.",
  "author": "Author Name"
}
```

### Example responses

**GET /quote**
```json
{
  "id": 3,
  "quote": "It does not matter how slowly you go as long as you do not stop.",
  "author": "Confucius"
}
```

**POST /quotes** → 201 Created
```json
{
  "id": 6,
  "quote": "An unexamined life is not worth living.",
  "author": "Socrates"
}
```

---

## Hello Endpoint

| Method | Path     | Description             |
|--------|----------|-------------------------|
| GET    | `/hello` | Returns a hello message |
