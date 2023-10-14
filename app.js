const express = require('express');
const app = express();
const {getTopics} = require('./controllers/topics.controller.js')
const {getArticleById} = require('./controllers/articles.contoller.js')
const {handlePSQLErrors, handleCustomErrors, handle500Errors} = require('./controllers/errors.controllers.js')
const {getsiteMap} = require('./controllers/api.controller.js');
const {getArticles, getCommentsByArticleID, addComment, patchVotesByArticleID} = require('./controllers/articles.controller.js')


app.use(express.json())


// valid endpoints
//console.log(app._router.stack.filter(r=>r.route).map(r=r=>r.route.path), "current endpoints")

app.get("/api", getsiteMap)
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles/:article_id/comments", getCommentsByArticleID)
app.post("/api/articles/:article_id/comments", addComment)
app.patch("/api/articles/:article_id", patchVotesByArticleID)

// catch all errors
app.all('/*', (req, res, next) => {
    res.status(404).send({message: "path not found"});
})

// Error handling middleware
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500Errors);

module.exports = app;