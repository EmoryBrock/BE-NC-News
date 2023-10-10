const {fetchArticleById, 
    fetchArticles, 
    fetchCommentsByArticleId,
    insertComment,
    isValidUsername,
    isValidArticleID} = require('../models/articles.model.js')

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
            return results
        })
        .catch(err => {next(err)})

}

exports.addComment = (req, res, next) => {
    const {article_id} = req.params
    const {username, body}= req.body

    if (!body || !username) return next({ 
        status: 400, 
        message: 'bad request'
    }) 

    Promise.all([isValidArticleID(article_id), isValidUsername(username)])
        .then(()=>{
            return insertComment(article_id, username, body)
        })
        .then((comment)=> {
            console.log(comment, "returned from model")
            res.status(201).send({"username": comment.author, "body": comment.body})
        })
        .catch(err => {
            console.log(err)
            next(err)})
}