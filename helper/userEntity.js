const { requestGraphAPI } = require('../graphAPI')

const {graphUrl} = require('../defaults/configGraphAPI')

const {SUCCESS, FAILED, BYPASSED} = require('../defaults/constants').ResponseStatus

const setContentAssignManager = managerId => ({ url: `${graphUrl}/directoryObjects/${managerId}`})

const assignManager = auth => ([id, managerId]) => 
    requestGraphAPI ({
        params: {auth, json:setContentAssignManager(managerId)}, 
        operator: 'assignManager',
        opts: {id},
    })

const getManager = auth => id =>
    requestGraphAPI({
        params: {auth}, 
        operator: 'getManager',
        opts: {id},
    })

const getDirectReports = auth => id => 
    (!id && 'SUCCESS')
    || requestGraphAPI({
        params: {auth}, 
        operator: 'getDirectReports',
        opts: {id},
    })

const search = auth => (key, value) => 
    requestGraphAPI({
        params : {auth},
        operator: 'getUsers',
        query: `${mapAAD.User[key]} eq '${value}'`, 
        // query: `objectId eq '48353d79-c657-442f-add0-2a81c98f2986'`,
    })


const resolveNotExist = value => 
    Promise.reject(FAILED)
    .tapCatch(console.log(`\t[Failed] User ${value} is not Exist`))

const resolveExist = value => 
    Promise.reject(BYPASSED)
    .tapCatch(console.log(`\t[ByPassed] User ${value} is Exist`))


const getUserInfo = auth => (key, value) => 
    search(auth)(key, value)
    // .tap(console.log)
    .then(listUser => listUser[0] || resolveNotExist(value))
    // .then(({objectId}) => objectId)

const checkNotExist = auth => (key, data) => 
    search(auth)(key, data[key])
    .then(listUser => (listUser[0] && resolveExist(data[key])) || data)
    // .then(listUser => (listUser[0] && deleteUser(auth)(listUser[0]['objectId'])) || data)
    // .tapCatch(deleteUser(auth)(listUser[0]['objectId'])))

const create = auth => entry => 
    requestGraphAPI({
            params: {auth, json: entry},
            operator: 'createUser',
    })

const update = auth => ([id, entry]) => 
    requestGraphAPI({
        params: {auth, json: entry},
        operator: 'updateUser',
        opts: {id},
    })
    .then(() => id)
    .tap(() => console.log(`[SUCCESS] updateUser ${id}`))

const deleteUser = auth => id => 
    requestGraphAPI({
        params : {auth},
        operator: 'deleteUser',
        opts: {id},
    })
    .tap(() => console.log(`[SUCCESS] deleteUser ${id}`))

module.exports = {
    search,
    getUserInfo,
    checkNotExist,
    create,
    update,
    assignManager,
    getManager, 
    getDirectReports,
}