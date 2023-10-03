const express = require('express');
const app = express();
const {getTopics} = require('./controllers/topics.controller.js')
const {getArticleById} = require('./controllers/getArticleById.contoller.js')


// valid endpoints
app.get("/api/topics", getTopics);
app.get("/api/articles/:artcle_id", (req, res) => {
res.status(200).send()
})

// catch all at this stage of development
app.use('/*', (req, res, next) => {
    res.status(404).send({message: "path not found"});
})

// general interal server err
app.use((err, req, res, ext) => {
    console.log(err)
    res.status(500).send({ message: 'I.S.E. something broke'})
})

module.exports = app;