
const request = Promise.promisify(require('request'))
const { OAuthParams, initialParam } = require('../defaults/configGraphAPI')

const parseToken = ({body}) => 
    ({ bearer:  JSON.parse(body).access_token })

// const getAccessToken = () => requestPost(OAUTH_PARAMS)

const getAccessToken = () => 
    request(Object.assign(OAuthParams, {method: 'post'}))

const initParams = () => 
    getAccessToken()
    .then(parseToken)
    .then(auth => Object.assign(initialParam, {auth}))

const requestAccessToken = () => 
    getAccessToken()
    .then(parseToken)


module.exports = { initParams, requestAccessToken }

//Using Adal-node
/*const AuthenticationContext = require('adal-node').AuthenticationContext
const context = new AuthenticationContext(`${hostUrl}/${tenant}`)

const getAccessToken = (context, resource, clientId, clientSecret) =>
    new Promise ((resolve, reject) => 
        context.acquireTokenWithClientCredentials(
            resource, clientId, clientSecret, (err, tokenRespone) => 
                (err && reject(err)) || resolve(tokenRespone.accessToken)
    )
)*/