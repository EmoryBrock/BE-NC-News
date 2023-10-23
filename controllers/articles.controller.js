const {fetchArticleById, 
    fetchArticles, 
    fetchCommentsByArticleId,
    insertComment,
    isValidUsername,
    isValidArticleID,
    calcNewVotes,
    updateVotesByArticleID} = require('../models/articles.model.js')


exports.getArticleById = (req, res, next) => {
    const id = req.params.article_id

    if (isNaN(id)) return next({ 
        status: 400, 
        message: 'bad request: this is not a number'
    })

    isValidArticleID(id)
    .then(()=>{
            return fetchArticleById(id)
        })
        .then((article) => {
            res.status(200).send({article})
        })
        .catch(err => {next(err)})
}

exports.getArticles = (req, res, next) => {
    // const { topic } = req.query
    fetchArticles().then((articles) => {
        res.status(200).send( {articles} );
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
            res.status(201).send({"username": comment.author, "body": comment.body})
        })
        .catch(err => {
            next(err)})
        }

exports.patchVotesByArticleID = (req, res, next) => {
    const id = req.params.article_id
    const newVotes = req.body.inc_votes

    isValidArticleID(id)
        .then (()=> {
            return calcNewVotes(id, newVotes)
        })
        .then((updatedVotes)=>{
            return updateVotesByArticleID(id, updatedVotes)
        })
        .then((article)=>{
            res.status(200).send({article})
        })
        .catch(err => {next(err)})

}