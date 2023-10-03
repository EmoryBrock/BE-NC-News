const express = require('express');
const app = express();
const {getTopics} = require('./controllers/topics.controller.js')
const {getsiteMap} = require('./controllers/api.controller.js');

app.get("/api/topics", getTopics);
app.get("/api", getsiteMap)

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