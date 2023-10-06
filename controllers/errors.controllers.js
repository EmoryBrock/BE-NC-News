exports.handleCustomErrors = (err,req,res, next) => {
    if (err.status) {
        console.log("custom error ->", err.message)
        res.status(err.status).send({ message: err.message });
    } else {
        next(err)
    }
}

exports.handle500Errors = (err, req, res, next) => {
    console.log(err, 'ERROR: unhandled error')
    return res.status(500).send({ message: 'I.S.E. something broke'})
}