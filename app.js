const express = require('express');
const app = express();
const cors = require('cors')
const {getTopics} = require('./controllers/topics.controller.js')
const {handlePSQLErrors, handleCustomErrors, handle500Errors} = require('./controllers/errors.controller.js')
const {getsiteMap} = require('./controllers/api.controller.js');
const {getAllUsers} = require('./controllers/users.controller.js')
const {getArticleById, getArticles, getCommentsByArticleID, addComment, patchVotesByArticleID} = require('./controllers/articles.controller.js')
const {deleteCommentByID} = require('./controllers/comments.controller.js')

app.use(cors())
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
app.delete("/api/comments/:comment_id", deleteCommentByID)
app.get("/api/users", getAllUsers)

// catch all errors
app.all('/*', (req, res, next) => {
    res.status(404).send({message: "path not found"});
})

// Error handling middleware
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500Errors);

module.exports = app;