const { fetchTopics } = require("./topics.model")


exports.isValidTopic = (topicQueried) =>{
    fetchTopics()
        .then((arrValidTopicList)=>{
            console.log(arrValidTopicList)
        //     result = arrValidTopicList.find(item => item === topicQueried)

        //     if (result === undefined) {
        //         return Promise.reject({
        //             status:404,
        //             message: `Topic "${topicQueried}" is not a valid query request `
        //         })
        //     }
        //     return true
        })
}