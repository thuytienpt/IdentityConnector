
// const fs = require('fs')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

const getData = filename => 
    fs.accessAsync(filename)
    .then(() => require(filename))
    .catch(err => ({}))

const readFile = filename => 
    fs.readFileAsync(filename, 'utf8')
    .then(content => (content))

const writeFile = filename => content => 
    fs.writeFileAsync(filename, content)

const formatContent = data => initContent => 
    Object.assign(initContent, data)

const saveDataToFile = (filename, data) => 
    getData(filename)
    // .tap(console.log('filename',filename))
    .then(formatContent(data))
    // .tap(content => console.log('contentSave, ', content))
    .then(content => JSON.stringify(content, null, '\t'))
    .then(writeFile(filename))


module.exports = { 
    // readFile,
    writeFile,
    saveDataToFile 
}