const request = require("supertest");
const app = require("../app");

describe("Quote Generator API", () => {
  // ── GET / ────────────────────────────────────────────────────────────────
  describe("GET /", () => {
    it("should return a welcome message with endpoint listing", async () => {
      const res = await request(app).get("/");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toMatch(/welcome/i);
      expect(res.body).toHaveProperty("endpoints");
    });
  });

  // ── GET /quote ───────────────────────────────────────────────────────────
  describe("GET /quote", () => {
    it("should return a single quote object with id, quote, and author", async () => {
      const res = await request(app).get("/quote");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("quote");
      expect(res.body).toHaveProperty("author");
    });

    it("should return a string for quote and author fields", async () => {
      const res = await request(app).get("/quote");
      expect(typeof res.body.quote).toBe("string");
      expect(typeof res.body.author).toBe("string");
    });
  });

  // ── GET /quotes ──────────────────────────────────────────────────────────
  describe("GET /quotes", () => {
    it("should return an array of quotes", async () => {
      const res = await request(app).get("/quotes");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should return at least one quote in the initial list", async () => {
      const res = await request(app).get("/quotes");
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("each quote should have id, quote, and author properties", async () => {
      const res = await request(app).get("/quotes");
      res.body.forEach((q) => {
        expect(q).toHaveProperty("id");
        expect(q).toHaveProperty("quote");
        expect(q).toHaveProperty("author");
      });
    });
  });

  // ── POST /quotes ─────────────────────────────────────────────────────────
  describe("POST /quotes", () => {
    it("should create a new quote and return 201 with the created object", async () => {
      const payload = {
        quote: "An unexamined life is not worth living.",
        author: "Socrates",
      };
      const res = await request(app).post("/quotes").send(payload);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.quote).toBe(payload.quote);
      expect(res.body.author).toBe(payload.author);
    });

    it("should include the new quote in the full list afterwards", async () => {
      const payload = { quote: "Cogito, ergo sum.", author: "René Descartes" };
      await request(app).post("/quotes").send(payload);

      const listRes = await request(app).get("/quotes");
      const found = listRes.body.some((q) => q.quote === payload.quote);
      expect(found).toBe(true);
    });

    it("should return 400 when 'quote' field is missing", async () => {
      const res = await request(app).post("/quotes").send({ author: "Unknown" });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 400 when 'author' field is missing", async () => {
      const res = await request(app)
        .post("/quotes")
        .send({ quote: "No author provided." });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 400 when body is completely empty", async () => {
      const res = await request(app).post("/quotes").send({});
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  // ── GET /hello ───────────────────────────────────────────────────────────
  describe("GET /hello", () => {
    it("should return a hello message", async () => {
      const res = await request(app).get("/hello");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toMatch(/hello/i);
    });
  });

  // ── 404 ──────────────────────────────────────────────────────────────────
  describe("Unknown routes", () => {
    it("should return 404 for an undefined route", async () => {
      const res = await request(app).get("/nonexistent");
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });
});
