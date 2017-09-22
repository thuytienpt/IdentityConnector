
// request = Promise.promisify(require('request'))
const { initParams, requestAccessToken } = require('./auth')
const {requestGraphAPI} = require('./request')
module.exports = {
    initParams,
    requestAccessToken,
    requestGraphAPI,
}

