const {deleteCommentByCommentID, isValidCommentID } = require('../models/comments.model.js')

exports.deleteCommentByID = (req, res, next) => {
    const id = req.params.comment_id

    isValidCommentID(id)
    .then(()=> {
        return deleteCommentByCommentID(id)
    })
    .then(()=>{
        res.status(204).send({})
    })
    .catch(err => {next(err)})
}