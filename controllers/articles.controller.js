const {fetchArticleById, fetchArticles} = require('../models/articles.model.js')

exports.getArticleById = (req, res, next) => {
    const id = req.params.article_id

    if (isNaN(id)) return next({ 
        status: 400, 
        message: 'bad request: this is not a number'
    })

    fetchArticleById(id)
        .then((article) => {
            res.status(200).send({article})
        })
        .catch(err => {next(err)})
}

exports.getArticles = (req, res, next) => {
    fetchArticles().then((articles) => {
        res.status(200).send({ articles });
    })
}