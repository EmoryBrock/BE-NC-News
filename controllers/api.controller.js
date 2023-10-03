const { fetchSiteMap } = require("../models/api.model")

exports.getsiteMap = (req, res, next) => {
    console.log("in api controller")
    fetchSiteMap().then((mapAPI) => {
        res.status(200).send({ mapAPI });
    }).catch((err) => {
        next(err)
    })
};