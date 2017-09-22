
Promise = require('bluebird')
request = Promise.promisify(require('request'))

const appObjectId = require('./defaults/config').app.objectId
const {initialParam} = require('./defaults/configGraphAPI')
const {graphUrl} = require('./defaults/configGraphAPI')
const graphAPI = require('./graphAPI')

const resourePath = `applications/${appObjectId}/extensionProperties/`

const listExtension = require('./defaults/extension')
// console.log(listExtension)
const updateParams = (params, name) => 
    Promise.all([
        initialParam.uri.replace('{resource_path}', resourePath),
        Object.assign({name}, listExtension[name]),
    ])
    // .tap(console.log)
    .then(([uri, json]) => Object.assign({}, params, {uri, json, method: 'post'}))
    // .tap(console.log)

const getExtension = params => 
    Promise.resolve(params.uri.replace('{resource_path}', resourePath))
    .then(uri => Object.assign(params, {method: 'get', uri}))
    .then(request)
    .then(({body}) => JSON.parse(body).value)


const registerExtension = params => extension => 
    Promise.resolve(updateParams(params, extension))
    // .tap(console.log)
    .then(request)
    .then(({body}) => body)
    .tap(console.log)
    .catch(({body}) => body['odata.error'].message)
    .tapCatch(console.error)

const registerListExtension = params => 
    Promise.map(Object.keys(listExtension), registerExtension(params))
    // .then(re => re.map(({body}) => JSON.parse(body)))

const deleteExt = objectId => params => 
    Promise.resolve(initialParam.uri.replace('{resource_path}', `${resourePath}${objectId}`))
     .then(uri=> Object.assign({}, params, {uri, method: 'delete'}))
     .tap(console.log)
    .then(request)
    .then(({body}) => body)



graphAPI.requestAccessToken()
.then(auth => Object.assign(initialParam, {auth}))
// .then(registerListExtension)
// .then(deleteExt('fd9442fa-3752-4074-9f0b-5b6fb97c1c19'))
.then(params => getExtension(params))
.then(list => list.map(({name, targetObjects}) => ({[name] : targetObjects[0]})))
// .then(bosy => console.log(body['odata.error'].message))
.then(console.log)
.catch(console.error)

// DELETE https://graph.windows.net/contoso.onmicrosoft.com/applications/269fc2f7-6420-4ea4-be90-9e1f93a87a64/extensionProperties/dc893d45-a75b-4ccf-9b92-ce7d80922aa7?api-version=1.5 HTTP/1.1




// module.exports = {registerListExtension, getExtension, registerExtension}
