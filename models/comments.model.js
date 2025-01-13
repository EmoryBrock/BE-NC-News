const db = require('../db/connection.js')

exports.isValidCommentID = (id) => {
    return db
        .query(`SELECT comment_id FROM comments WHERE comment_id=$1;`, [id])
        .then(({rows})=> {
            if (rows.length === 0) {
                return Promise.reject({
                    status:404,
                    message: `No comment found with id ${id}`
                })
            }
            return true
        })
}
exports.deleteCommentByCommentID = (id) => {
    return db
        .query(`
            DELETE FROM comments
            WHERE comment_id=$1
            RETURNING *;`, [id])
        .then(({rows})=> {
            return rows[0]
        })
}

exports.fetchCommentsByArticleId = (id) =>{
    return db
        .query(
            `SELECT * FROM comments
            WHERE article_id=$1
            ORDER BY created_at DESC;`, [id]) 
        .then(({rows}) => {
                return rows
        })
}

exports.insertComment = (article_id, username, body) => {   
    return db
        .query(
            `INSERT INTO comments 
            (body, article_id, author) 
            VALUES 
            ($1, $2, $3)
            RETURNING *;`,[body, article_id, username])
        .then((result)=> {
            return result.rows[0]
        })
}