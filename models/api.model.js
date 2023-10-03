const {readFile, writeFile } = require('fs/promises')


exports.fetchSiteMap = () => {
    return readFile('./endpoints.json', 'utf8')
        .then((file) => {
            const mapAPI = JSON.parse(file)
            return mapAPI;
    })
}