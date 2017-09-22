
const {proxy} = require('./config')

const tenantID     = 'vngms.onmicrosoft.com'

const authorityUrl = 'https://login.windows.net'
const graphBaseUrl = 'https://graph.windows.net'
const graphUrl = `${graphBaseUrl}/${tenantID}`

const apiVersionAAD     ='1.6'
const tokenEndpointPath = 'oauth2/token'
const authorizePath     = 'oauth2/authorize'

const clientId     = '287fe60f-4f40-4ba8-ac34-9f85039c0490'
const clientSecret = 'sRx02BYnsO/nHEoMka4waxZExPPEt/uiVK1tI5h/Bv8='

const graphAPIUrl = `${graphBaseUrl}/${tenantID}/{resource_path}?api-version=${apiVersionAAD}`
const graphAPIExtUrl = `${graphBaseUrl}/${tenantID}/applications/<applicationObjectId>/extensionProperties?api-version=1.6`

const initialParam = {
    uri     : graphAPIUrl,
    proxy   : proxy,
    encoding: 'utf8',
    auth: { bearer: '{token}' }
}

const OAuthParams = {
    proxy   : proxy,
    url     : `${authorityUrl}/${tenantID}/${tokenEndpointPath}`,
    form    :   {         
        grant_type      : 'client_credentials',
        client_id       : clientId,
        client_secret   : clientSecret,
        resource        : graphBaseUrl,
    },
    headers : {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    followRedirect : false,
    encoding: 'utf8',
}



// const graphAPI = {
//     url: `${graphBaseUrl}/${tenantID}`,
//     params: initialParam,
//     OAuthParams,
// }

module.exports = {
    graphUrl, 
    OAuthParams,
    initialParam,
}
