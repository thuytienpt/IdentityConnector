

const { processEvent } = require('./processEvent')

const {SUCCESS, FAILED, BYPASSED} = require('../defaults/constants').ResponseStatus

const byPassProcess = (auth, state) => state

const failedProcess = (auth, state, event) => {
    state.errorEvents = [...state.errorEvents, event]
    return state
}

const successProcess = (auth, state) => 
    Promise.reduce(state.errorEvents, (init, event) => 
        (processEvent(auth)(event))
        // .tap(({status}) => console.log(status))
        .then(({status, event}) => (status === FAILED) ? [...init, event] : init)
        // .tap(() => console.log(init.length))
    , [])
    .tap(console.log(getErrorEvent(state)))
    .then(errorEvents => Object.assign(state, {errorEvents}))
    // .tap(() => console.log(getErrorEvent(state), '-----------------------------successProcess'))

// const getErrorEvent = ({errorEvents}) => errorEvents.map(({orgName}) => orgName)

const getErrorEvent = ({errorEvents}) => errorEvents.length
const responeMap = {
    [SUCCESS] : successProcess,
    [FAILED]  : failedProcess,
    [BYPASSED]: byPassProcess,
}

const handleEvents = auth => state => 
    Promise.resolve(state.events.splice(0, 1))
    .then(events => 
        events[0] || Promise.reject([])
        // .tapCatch(console.log('[   EMPTY     ]'))
    )
    // .delay(1000)
    // .tap(event => console.log('run'))
    .then(processEvent(auth))
    // .tap(({status}) => console.log((responeMap[status]).name))
    // .tap(({status}) => console.log('\t ---> ', (responeMap[status]).name)
    .then(({status, event}) => responeMap[status](auth, state, event))
    // .tap(() => console.log(getErrorEvent(state)))
    .catch(() => state)

    
module.exports = { handleEvents }