const db = require('../db/connection.js')

exports.isValidArticleID = (id) => {
    return db
        .query(`SELECT article_id FROM articles WHERE article_id=$1;`, [id])
        .then(({rows})=> {
            if (rows.length === 0) {
                return Promise.reject({
                    status:404,
                    message: `No article found with id ${id}`
                })
            }
            return true
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

exports.fetchArticles = (topic) => {

    const queryValues =[]
    let queryStr = `SELECT
    articles.author,
    articles.title, 
    articles.article_id, 
    articles.topic, 
    articles.created_at, 
    articles.votes,
    articles.article_img_url, 
    COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id`

    if (topic) {
        queryValues.push(topic)
        queryStr += `
        WHERE articles.topic = $1`
    }

    queryStr += `
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`

    return db
        .query(queryStr, queryValues)
        .then(({rows}) => {
            return rows
        })
}


exports.calcNewVotes = (id, newVotes) => {
    return db
        .query(`
            SELECT votes FROM articles 
            WHERE article_id=$1`, [id])
        .then(({rows})=> {
            const currentVotes = rows[0].votes
            return updatedVotes = currentVotes + newVotes
        })
}

exports.updateVotesByArticleID = (id, updatedVotes) => {
    return db
        .query(`
            UPDATE articles
            SET votes=$1
            WHERE article_id=$2
            RETURNING *;`, [updatedVotes, id])
        .then(({rows})=> {
            return rows[0]
    })
}