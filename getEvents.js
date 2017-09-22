// const request = bluebird.promisifyAll(require('request'))
const { identityAPI } = require('./defaults/config')

const url = identityAPI.url
const limit = identityAPI.limitRequests

// const request = Promise.promisifyAll(require('request'))

const parseEvent = ({body}) => body.result.map(({p}) => p)

const formatState = (start, events) => result => 
    ({
        start  :  start + limit,
        events : [...events, ...result]
    })

const getEvents = ({start, events}) => 
    request({
        method: 'post',
        url,
        json: {start, limit},
    })
    .then(parseEvent)
    .then(formatState(start, events))

module.exports = { getEvents }

