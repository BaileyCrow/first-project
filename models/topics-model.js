const db = require("../db/connection");
const { checkUserExists } = require("./comments-models");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "No topics found" });
    }
    return rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      return rows[0];
    });
};

exports.fetchArticles = (sort_by = "created_at") => {
  const validSortBy = ["created_at"];
  let sqlQuery = `SELECT 
      articles.article_id,
      articles.title,
      articles.topic,
      articles.author,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      CAST(COUNT(comments.comment_id) AS INT) AS comment_count 
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id`;

  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (sort_by) {
    sqlQuery += ` ORDER BY ${sort_by} DESC`;
  }

  return db.query(sqlQuery).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "No articles found" });
    }
    return rows;
  });
};

exports.fetchCommentByArticleId = (article_id) => {
  return db
    .query(
      `SELECT 
  comment_id,
  votes,
  created_at,
  author,
  body,
  article_id
  FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.addCommentToArticle = (article_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: missing required fields",
    });
  }

  return checkUserExists(username).then(() => {
    let sqlQuery = ` INSERT INTO comments 
  (article_id, author, body, votes, created_at)
  VALUES ($1, $2, $3, 0, NOW())
  RETURNING *;`;
    const queryValues = [article_id, username, body];

    return db.query(sqlQuery, queryValues).then(({ rows }) => {
      return rows[0];
    });
  });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  const sqlQuery = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
  `;

  return db.query(sqlQuery, [inc_votes, article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "article not found" });
    }
    return rows[0];
  });
};
