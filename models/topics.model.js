const db = require('../db/connection.js');

exports.isValidTopic= (topic) => {
    return db
        .query(`SELECT * FROM topics WHERE slug=$1;`, [topic])
        .then(({rows})=> {
            if (rows.length === 0) {
                return Promise.reject({
                    status:404,
                    message: `bad request`
                })
            }
            return true
        })
}

exports.fetchTopics = () => {
    return db
        .query("SELECT * FROM topics;")
        .then(({rows}) => {
            return rows
        });
}