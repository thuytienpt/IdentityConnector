
Promise = require('bluebird')
Promise.config({cancellation: true})

// const {getEvents} = require('./getEvents')
const {handleEvents} = require('./handleEvents')
const {writeFile} = require('./helper/fileIO')
const graphAPI = require('./graphAPI')
const timeBased = require('./defaults/config').timeBased
let state = require('./defaults/state')

// const {registerListExtension} = require('./registerExtension')

const setCronTask =  fn => timeBased => 
    fn(state)
    // .tap(console.log('state, ', fn.name, ': ', state.start))
    .catch(state => state)
    .then((newState) => Object.assign(state, newState))
    // .tap(newState => console.log('newState, ', fn.name, ': ', newState.start))
    .delay(timeBased)
    // .then(_ => )
    .then(() => setCronTask(fn)(timeBased))


// Test GetEvents Base JSON files--------------------------------
const listEvents = require('./event')
console.log(listEvents.length)
const limit = 4
const formatState = (start, events) => result => 
    ({
        start  :  start + limit,
        events : [...events, ...result]
    })
const getEvents = ({start, events}) => 
    Promise.resolve(listEvents.splice(0, limit))
    .then(events => events.map(({type, data}) => Object.assign(data, {type})))
    .then(result => 
        ({
            start  :  start + limit,
            events : [...events, ...result]
        })
    )
//------------------------------------------------------------------------------

const main = () => {
    graphAPI.requestAccessToken()
    // .tap(console.log)
    .then(auth => setCronTask(handleEvents(auth))(timeBased.handleEvents))
    .then(setCronTask(getEvents)(timeBased.getEvents))
    // .then(console.log)
    .catch(err => console.log(state.start))
}

 main()


/*    graphAPI.requestAccessToken()
    // .tap(console.log)ngt
    .then(auth => setCronTask(handleEvents(auth))(timeBased.handleEvents))
    .then(setCronTask(getEvents)(timeBased.getEvents))
    // .then(_ => getEvents(state))
    // .tap(re => console.log(re.events.length))
    // .then(({events}) => JSON.stringify(events, null, ' '))
    // .then(writeFile(`${process.cwd()}/defaults/eventsHR.json`))
    // registerListExtension()
*/