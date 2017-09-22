// const bluebird = require('bluebird')
const request = Promise.promisify(require('request'))
const {initialParam} = require('../defaults/configGraphAPI')

const { responseRequest } = require('./response')

const initParam = (params, method) => 
    Promise.resolve(Object.assign({method}, initialParam, params))

const replaceResoursePath = resourcePath => uri => 
    Promise.resolve(uri.replace('{resource_path}', resourcePath))

const addQueryOption = (query, uri) => 
    (query && `${uri}&$filter=${query}`) || uri

const formatUrl = (resourcePath, query) => params =>
    replaceResoursePath(resourcePath)(addQueryOption(query, params.uri))
    .then(uri => Object.assign(params, {uri}))

const sendRequest = (method, resourcePath) => (params, query) =>
    initParam(params, method)
    .then(formatUrl(resourcePath, query))
    // .tap(params => console.log(params))
    .tap(({uri}) => console.log(uri))
    .then(request)
    // .then(params => 
    //     Promise.resolve(+new Date())
    //     .then(t => 
    //         request(params)
    //         .tap(() => console.log(`${params.uri} : ${+new Date() -t}`))
    //     )

    // )
    // .tap(({body}) => console.log(body))
    .then(responseRequest)
    // .tap(console.log)
    // .tapCatch(console.error)


const getUsers     = ()     => sendRequest('get', `users`)
const getSpecUser  = ({id}) => sendRequest('get', `users/${id}`) 

const createUser   = ()     => sendRequest('post', `users`)
const updateUser    = ({id}) => sendRequest('patch', `users/${id}`) 
const deleteUser    = ({id}) => sendRequest('delete', `users/${id}`)


const getGroups     = ()     => sendRequest('get', `groups`)
const getSpecGroup  = ({id}) => sendRequest('get', `groups/${id}`) 

const createGroup   = ()     => sendRequest('post', `groups`)
const updateGroup   = ({id}) => sendRequest('patch', `groups/${id}`) 
const deleteGroup   = ({id}) => sendRequest('delete', `groups/${id}`)

const isMemberOf    = ()    => sendRequest('post', `isMemberOf`)
const getMembers    = ({id}) => sendRequest('get', `groups/${id}/$links/members`)
const addMember     = ({id}) => sendRequest('post', `groups/${id}/$links/members`)
const deleteMember  = ({id, memberId}) => sendRequest('delete', `groups/${id}/$links/members/${memberId}`)

const assignManager    = ({id}) => sendRequest('put', `users/${id}/$links/manager`) 
const getManager       = ({id}) => sendRequest('get', `users/${id}/$links/manager`) 
const getDirectReports = ({id}) => sendRequest('get', `users/${id}/$links/directReports`) 

const mapRequest = {
    getUsers,
    getSpecUser,
    createUser,
    updateUser,
    deleteUser,
    getGroups, 
    getSpecGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    getMembers,
    addMember,
    deleteMember,
    isMemberOf,
    assignManager,
    getManager,
    getDirectReports
}

const requestGraphAPI = ({params, operator,  opts,  query}) => 
    mapRequest[operator](opts)(params, query)
    // .tap(console.log('otps: ', otps)) 

module.exports = { requestGraphAPI }



