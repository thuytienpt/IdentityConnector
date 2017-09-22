// const { 
//     graphUrl, 
//     tenant,
//     apiVersion,
// } = require('../config')

const { requestGraphAPI } = require('./request')

let GroupOperator = {}

// GroupOperations.getAll = params => groupId => 
//     requestGraphAPI('groups')(Object.assign(params, {method: 'get'}))

GroupOperator.getAll = params => 
    requestGraphAPI('get', params)(`groups`)

GroupOperator.getSpecific = params => id => 
    requestGraphAPI('get', params)(`groups/${id}`)


GroupOperator.search = query => params => 
    requestGraphAPI('get', params)(`groups`, query)


GroupOperator.create = params => entryJSON => 
    requestGraphAPI('post', Object.assign(params, {json: entryJSON}))('groups')

// Group.delete = params => groupID => 
//     requestGraphAPI('delete', params)('group', groupID)

// const updateUser = (token, data) => 
//     new GraphAPI(token, '/users/tienptt@vng.vn?').patch(data)
module.exports = GroupOperator


// module.exports = {
//     getAll, 
//     getSpec,
//     delete,
//     create,
// }