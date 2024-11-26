const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => seed(data));

afterAll(() => {
  db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
describe("GET /api/topics", () => {
  test("200: should return an array of topics objects when topics exist", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(data.topicData.length);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  describe("GET /api/topics", () => {
    test("404: should return 404 error if no topics are found", () => {
      db.query = jest.fn().mockResolvedValue({ rows: [] });
      return request(app)
        .get("/api/topics")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "No topics found",
          });
        });
    });
  });
});
