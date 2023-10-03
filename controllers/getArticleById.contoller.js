
exports.getArticleById = (req, res, next) => {
    console.log("in getArticle controller")
    res.status(200).send ({message: "will return article"});
}