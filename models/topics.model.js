const db = require('../db/connection');

exports.fetchTopics = () => {
    console.log("in model code set")
    return db
        .query("SELECT * FROM topics;")
        .then(({rows}) => {
            return rows
        });
}