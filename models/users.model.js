const db = require('../db/connection')

exports.fetchAllUsers = ()=> {
    return db
        .query("SELECT * FROM users;")
        .then(({rows}) => {
            return rows
        })
}

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
            return true
        })
}