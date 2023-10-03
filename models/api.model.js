const {readFile, writeFile } = require('fs/promises')

function getAPIList () {
    const mapAPI = fetchSiteMap()
    return Object.keys(mapAPI)
}


exports.fetchSiteMap = () => {
    return readFile('./endpoints.json','utf8')
        .then((file) => {
            const mapAPI = JSON.parse(file)
            return mapAPI;
        })
}
