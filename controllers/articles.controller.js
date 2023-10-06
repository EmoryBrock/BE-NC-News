const {fetchArticleById, 
    fetchArticles, 
    fetchCommentsByArticleId,
    insertComment} = require('../models/articles.model.js')

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

    Promise.all([fetchArticleById(article_id), fetchCommentsByArticleId(article_id)])
        .then((results) => {
            res.status(200).send(results[1])
            return Promise.all([fetchArticleById(article_id), fetchCommentsByArticleId(article_id)])
        })
        .catch(err => {next(err)})

}

exports.postComment = (req, res, next) => {
    const {article_id} = req.params
    const {username, body}= req.body

    insertComment(article_id, username, body).then((comment)=> {
        res.status(201).send({"username": comment.author, "body": comment.body})
    })
}