
Promise = require('bluebird')
const request = Promise.promisify(require('request'))
const graphAPI = require('./graphAPI')

const {initialParam} = require('./defaults/configGraphAPI')
const {getDirectMembers} = require('./helper/groupEntity')

const apiVersion = '?api-version=1.6'
const extUrl = 'Microsoft.DirectoryServices.User'
const ICObjectID = 'db42fe92-b9d8-4914-91e2-df8322aa3a67'

const initParams = auth => uri =>
    Object.assign({}, initialParam, {method: 'delete', uri, auth})

const deleteMember = auth => ({url}) => 
    Promise.resolve(initParams(auth)(url.replace(extUrl, apiVersion)))
    .tap(({uri}) => console.log(uri))
    .then(request)
    // .then(({body}) => console.log(body))
    .then(({statusCode}) => statusCode)

graphAPI.requestAccessToken()
.then(auth => 
    getDirectMembers(auth)(ICObjectID)
    .then(listMember => 
        // deleteMember(auth)(listMember[0])
        Promise.all(listMember).map(deleteMember(auth))
    )
)
.then(console.log)
.catch(console.error)

