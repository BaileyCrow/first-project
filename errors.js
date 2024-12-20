exports.psqlErrorHandler = (err, req, res, next) => {
  if (err.code) {
    res.status(400).send({ msg: "Bad request" });
  } else next(err);
};
exports.customErrorHandler = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};
exports.serverErrorHandler = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};
