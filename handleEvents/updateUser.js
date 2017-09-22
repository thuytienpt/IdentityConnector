
const {SUCCESS, FAILED, BYPASSED} = require('../defaults/constants').ResponseStatus

const { createEntryAAD } = require('../helper/mapToAAD')
const { transform } = require('../helper/transformData')
const {
    addMember,
    getGroupInfo,
} = require('../helper/groupEntity')

const {
    update,
    assignManager, 
    getUserInfo, 
    checkNotExist,
} = require('../helper/userEntity')

const {
    transformToUpdate,
    transformNullValue
} = require('../helper/transformData')


// const isUpdateManager = data => data.hasOwnProperty('reportingLine') 
const prepareData = (data, {objectId, displayName, telephoneNumber, streetAddress}) => 
    Promise.resolve({objectId, displayName, telephoneNumber, streetAddress})
    .then(userAAD => Object.assign(data, userAAD))
    .then(transformNullValue)
    .then(transformToUpdate)
    // .tap(console.log)



const checkUpdateManager = auth => data => 
    data.hasOwnProperty('reportingLine') 
    && getUserInfo(auth)('id', `IC_${data.reportingLine}`)

const updateUser = data => auth => 
    Promise.resolve(data)
    .tap(() => console.log(`[UpdateUser]:  ${data.id}`))
    .then(() => +new Date())
    .then(t => 
        Promise.resolve([
            getUserInfo(auth)('id', `IC_${data.id}`),
            checkUpdateManager(auth)(data),
        ])
        .then(listPromises => 
            Promise.all(listPromises)
            .catch(error => 
                Promise.reject(error)
                .tap(listPromises.map(p => p.cancel()))
            )
        )
        .tap(() => console.log('check all: ', +new Date() - t))
        .tapCatch(() => console.log('check all Catch: ', +new Date() - t))
    )
    // .tap(console.log)
    .then(([user, manager]) =>([
        prepareData(data, user)
        // .then(entry => update(auth)([user.objectId, entry]))
        // .then(assignManager(auth)([user.objectId, manager.objectId]))
        ])
    )
    .all()


module.exports = {updateUser}