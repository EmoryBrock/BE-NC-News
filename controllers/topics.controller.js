const { fetchTopics } = require("../models/topics.model")

exports.getTopics = (req, res) => {
    console.log("in controller code set")
    fetchTopics().then((topics) => {
        console.log(topics, "returned response from model")
        res.status(200).send({ topics });
    })
};