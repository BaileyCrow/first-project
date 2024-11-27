const express = require("express");
const {
  getTopics,
  getArticleById,
  getArticles,
} = require("./controllers/topics-controller");
const {
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require("./errors");
const app = express();
const endpointsJson = require("./endpoints.json");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

// app.all("*", (req, res) => {
//   res.status(404).send({ msg: "route not found" });
// });

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
