const express = require("express");
const { getTopics } = require("./controllers/topics-controller");
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

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route Not found" });
});

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
