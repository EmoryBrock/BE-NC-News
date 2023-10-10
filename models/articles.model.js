const db = require('../db/connection');

exports.isValidArticleID = (id) => {
    return db
        .query(`SELECT article_id FROM articles WHERE article_id=$1;`, [id])
        .then(({rows})=> {
            if (rows.length === 0) {
                return Promise.reject({
                    status:404,
                    message: `No artcile found with id ${id}`
                })
            }
            return rows[0]
        })
}


exports.fetchArticleById = (id) => {
    return db
        .query(`SELECT * FROM articles WHERE article_id=$1;`, [id])
        .then(({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({ 
                    status: 404, 
                    message: `No article found for id ${id}`
                })
            }

            return rows[0]
        })
}

exports.fetchArticles = () => {
    return db
        .query(
            `SELECT
            articles.author,
            articles.title, 
            articles.article_id, 
            articles.topic, 
            articles.created_at, 
            articles.votes,
            articles.article_img_url, 
            COUNT(comments.article_id) AS comment_count
            FROM articles
            LEFT JOIN comments ON comments.article_id = articles.article_id
            GROUP BY articles.article_id
            ORDER BY articles.created_at DESC;`)
        .then(({rows}) => {
            return rows
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
    
    // let article_id = 1
    // let body = "This is a new comment to track"
    // let username = 'rogersop'
    
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

//added the for functionality, will move to users.model when /api/users endpoint is implemented
exports.isValidUsername = (username)=> {

    return db
        .query(`SELECT username FROM users
                WHERE username=$1;`, [username])
        .then(({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({ 
                    status: 404, 
                    message: `Username does not exist`
                })
            }
            return rows
        })
}