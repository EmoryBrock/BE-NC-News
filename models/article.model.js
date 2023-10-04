const db = require('../db/connection.js')

exports.fetchArticleById = (id) => {
    return db
        .query(`SELECT * FROM articles WHERE article_id=$1;`, [id])
        .then(({rows}) => {
            if (rows.rowCount === 0){
                return Promise.reject({
                    status: 404, 
                    message: `No article found for id ${id}`
                })
            }
            return rows[0]
        })
}
