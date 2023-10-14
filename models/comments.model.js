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
            return rows[0]
        })
}

exports.deleteCommentByCommentID = (id) => {
    console.log(id, "in model");
    return db
        .query(`
            DELETE FROM comments
            WHERE comment_id=$1
            RETURNING *;`, [id])
        .then(({rows})=> {
            console.log(rows)
            // return rows[0]
        })
}