const { fetchSiteMap } = require("../models/api.model")

exports.getsiteMap = (req, res, next) => {
    fetchSiteMap().then((mapAPI) => {
        res.status(200).send({ mapAPI });
    }).catch((err) => {
        next(err)
    })
};