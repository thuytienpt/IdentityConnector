
mapAAD  = require('../defaults/mapAttributes')
const {SUCCESS, FAILED, BYPASSED} = require('../defaults/constants').ResponseStatus

const { TypeEvent } = require('../defaults/constants')
const { createGroup } = require('./createGroup')
const { updateGroup } = require('./updateGroup')
const { createUser } = require('./createUser')
// const { updateUser } = require('./updateUser')
const { moveUser } = require('./moveUser')

const eventsMap = {
    // [TypeEvent.SNAP_ORG_CREATED]  : createGroup,
    // [TypeEvent.SNAP_USER_CREATED] : createUser, 
    // [TypeEvent.ORG_UPDATED]   : updateGroup,
    // [TypeEvent.USER_CREATED]  : createUser,
    // [TypeEvent.USER_UPDATED]  : updateUser,
    [TypeEvent.USER_MOVED]    : moveUser,
}
const invalidType = (type) => 
    Promise.reject(BYPASSED)
    // .catch(status => status)
    // .tapCatch(console.log(`\t[ByPassed] : Invalid event.type = ${type}`))


const mapEventType = (event)=> 
    eventsMap[event.type] || invalidType(event.type)

const processEvent = auth => event => 
    Promise.resolve(event)
    // .tap(console.log('\t Type : ', event.type))
    .then(mapEventType)
    .then(mappingFn => mappingFn(event)(auth))
    .then(() => SUCCESS)
    .catch(status => status)
    // .tapCatch(console.log('FAILED'))
    .then(status => ({status, event}))
    // .tap(r => console.log(r.status))
    // .tap(({status}) => console.log(status))

module.exports = { processEvent }