const {readFile, writeFile } = require('fs/promises')


exports.fetchSiteMap = () => {
    console.log("in model controller")
    return readFile('./endpoints.json', 'utf8')
        .then((file) => {
            const mapAPI = JSON.parse(file)
            console.log(mapAPI)
            return mapAPI;
    })
}