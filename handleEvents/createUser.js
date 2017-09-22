
const {SUCCESS, FAILED, BYPASSED} = require('../defaults/constants').ResponseStatus

const { createEntryAAD } = require('../helper/mapToAAD')
const { transform } = require('../helper/transformData')
const {
    addMember,
    getGroupInfo,
} = require('../helper/groupEntity')

const {
    create,
    assignManager, 
    getUserInfo, 
    checkNotExist,
} = require('../helper/userEntity')

const ICObjectID = 'db42fe92-b9d8-4914-91e2-df8322aa3a67'
const domainVNG = 'vng.com.vn'

const prepareData = data =>  
    transform(data)
    .then(entry => Object.assign(entry, {userPrincipalName: `${data.id}@${domainVNG}`}))
    .then(createEntryAAD('User', false))
    .tap(entry => console.log('\t [ENTRY]: \n \t', entry))


const insertToAAD = (auth, entry) => 
    create(auth)(entry)
    .tap(id => addMember(auth)([ICObjectID, id]))
    .tap(id => console.log('\t[SUCCESS] Request Create Group objectId = ', id))


const createUser = data => auth => 
    // Promise.resolve(data)
    Promise.resolve(Object.assign(data, {id: `IC_${data.id}`}))
    .tap(() => console.log(`[CreateUser]:  ${data.id}`))
    .then(() => +new Date())
    .then(t => 
        Promise.resolve([
            checkNotExist(auth)('id', data),
            // getUserInfo(auth)('id', `IC_${data.reportingLine}`),
            getGroupInfo(auth)('id', data.departmentID),
            prepareData(data)
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
    // .then(() => 
    //     ([
    //         checkNotExist(auth)('id', data),
    //         getGroupInfo(auth)('id', data.departmentID),
    //         prepareData(data)
    //     ])
    // )
    // .tap(console.log)
    // .then(listPromises => 
    //     Promise.all(listPromises)
    //     .catch(error => 
    //         Promise.reject(error)
    //         .tap(listPromises.map(p => p.cancel()))
    //     )
    // )
    // .tap(parent => console.log('\t getParentInfo : ', parent))

    .then(([check, group, entry]) => 
    // .then(([check, manager, group, entry]) => 
        insertToAAD(auth, entry)
        .then(objectId => [
            addMember(auth)([group.objectId, objectId])
            .tap(() =>console.log(`\t[SUCCESS] Request Add Member Group ${group.mailNickname}`)),
            // assignManager(auth)([objectId, manager.objectId])
            // .tap(() =>console.log(`\t[SUCCESS] Request Assign Manager ${data.reportingLine}`)),
        ])
        .all()
    )

module.exports = { createUser }

