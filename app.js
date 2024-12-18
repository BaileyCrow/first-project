const cors = require("cors");
const express = require("express");
const {
  getTopics,
  getArticleById,
  getArticles,
  getCommentByArticleId,
  postCommentByArticleId,
  patchArticleById,
} = require("./controllers/topics-controller");
const {
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require("./errors");
const app = express();
const endpointsJson = require("./endpoints.json");

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res
    .status(200)
    .send("Welcome weary traveller! Visit /api for available endpoints.");
});

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleById);

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
