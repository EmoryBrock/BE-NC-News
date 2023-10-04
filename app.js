const express = require('express');
const app = express();
const {getTopics} = require('./controllers/topics.controller.js')
const {getArticleById} = require('./controllers/getArticleById.contoller.js')
const {handleCustomErrors, handle500Errors} = require('./controllers/errors.controllers.js')
const {getsiteMap} = require('./controllers/api.controller.js');


// valid endpoints
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById)
app.get("/api", getsiteMap)

// catch all at this stage of development
app.all('/*', (req, res, next) => {
    res.status(404).send({message: "path not found"});
})

// Error handling middleware
app.use(handleCustomErrors);
app.use(handle500Errors);

module.exports = app;