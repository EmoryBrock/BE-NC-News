const {fetchArticleById, 
    fetchArticles, 
    fetchCommentsByArticleId} = require('../models/articles.model.js')

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

exports.getCommentsByArticleID = (req, res, next) => {
    const {article_id }= req.params

    if (isNaN(article_id)) return next ({
        status: 400,
        message: `bad request: this is not a number`
    })

    fetchCommentsByArticleId(article_id)
    .then((article) => {
          res.status(200).send(article)
    })
    .catch(err => {next(err)})

}