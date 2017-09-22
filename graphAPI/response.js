
const responseMap = {
    200: body => body.value || body.url,
    201: body => body.objectId,
    204: ()   => null, 
}

const parseContent = body => 
    ((typeof body === 'string' && body) && JSON.parse(body)) || body


const throwRequestError = body => 
    Promise.resolve(body['odata.error'])
    .then(({code, message}) => Promise.reject({[code]: message.value}))

const isRequestSuccessful = statusCode => 
    responseMap[statusCode] || throwRequestError

const responseRequest = response => 
    Promise.resolve(isRequestSuccessful(response.statusCode))
    // .tap(console.log)
    .then(fnResponse => fnResponse(parseContent(response.body)))
    // .tap(console.log)
    // .tap(console.log('statusMessage: ', response.body))
    // .tap(console.log)

module.exports = { responseRequest }


