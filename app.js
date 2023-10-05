const express = require('express');
const app = express();
const {getTopics} = require('./controllers/topics.controller.js')
const {getsiteMap} = require('./controllers/api.controller.js');
const {getArticles, getCommentsByArticleID} = require('./controllers/articles.controller.js')


app.get("/api/topics", getTopics);
app.get("/api", getsiteMap);

app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id/comments", getCommentsByArticleID)

// console.log(app._router.stack.filter(r=>r.route).map(r=r=>r.route.path), "current endpoints")


// catch all at this stage of development
app.use('/*', (req, res, next) => {
    res.status(404).send({message: "path not found"});
})

// general interal server err
app.use((err,req,res, next) =>{
    if (err.code === '22P02') {
        res.status(400).send({message: 'bad request'})
    } else { 
        next(err)
    }
})

app.use((err, req, res, next) =>{
    if (err.status) {
        res.status(err.status).send({message: err.message})
    } else {
        next(err)
    }
})


app.use((err, req, res, ext) => {
    console.log(err)
    res.status(500).send({ message: 'internal server error'})
})

module.exports = app;