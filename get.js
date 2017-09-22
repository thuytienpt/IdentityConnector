const ISO = '89202fd2-9bf7-415c-944a-a52e06e5be21'


Promise = require('bluebird')
const {getEvents} = require('./getEvents')
const graphAPI = require('./graphAPI')

const searchGroup = require('./helper/groupEntity').search
const {
    search, 
    assignManager, 
    getManager, 
    getDirectReports,
} = require('./helper/userEntity')

mapAAD  = require('./defaults/mapAttributes')

graphAPI.requestAccessToken()
.then(auth => searchGroup(auth)('objectId', ISO))
.tap(console.log)