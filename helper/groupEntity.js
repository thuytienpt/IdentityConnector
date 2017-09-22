
// const mapAAD = require('../defaults/mapAttributes').Group
const { requestGraphAPI } = require('../graphAPI')

const {graphUrl} = require('../defaults/configGraphAPI')

const {SUCCESS, FAILED, BYPASSED} = require('../defaults/constants').ResponseStatus
const parent = {
    objectId: null, 
    mailNickname: '',
}

const ICObjectId = 'db42fe92-b9d8-4914-91e2-df8322aa3a67'
const idVNG = '13113' 

const search = auth => (key, value) => 
    requestGraphAPI({
        params : {auth},
        operator: 'getGroups',
        // query: `${mapAAD.Group[key]} eq '${value}'`, 

        query: `${key} eq '${value}'`, 
        // query: `objectId eq '458f4ccf-3de6-4f16-80c5-d8bc5847bc83'`, 
    })

const isCompany = parentID => (parentID == idVNG) || (!parentID)

const setContentAddMember = memberId => ({ url: `${graphUrl}/directoryObjects/${memberId}`})

const setMailNickname = (data, {mailNickname}) => 
    Object.assign(data, {mailNickname: `${mailNickname}${data.orgCode}`})

const resolveNotExist = value => 
    Promise.reject(FAILED)
    .tapCatch(console.log(`\t[Failed] Group ${value} is not Exist`))

const resolveExist = value => 
    Promise.reject(BYPASSED)
    .tapCatch(console.log(`\t[ByPassed] Group ${value} is Exist`))

// const findGroup = (auth, id) => search(auth)('id', id)

const getGroupInfo = auth => (key, value) => 
    search(auth)(key, value)
    // .tap(console.log)
    .then(listParent => listParent[0] || resolveNotExist(value))
    .then(({objectId, mailNickname}) => ({objectId, mailNickname}))

const checkNotExist = auth => (key, data) => 
    search(auth)(key, data[key])
    .then(listGroup => (listGroup[0] && resolveExist(data[key])) || data)
    // .then(listGroup => (listGroup[0] && deleteGroup(auth)(listGroup[0]['objectId'])) || data)


const getParentInfo = auth => ({parentID}) => 
    (isCompany(parentID) && Promise.resolve(parent).tap(console.log('\t Parent is VNG')))
    || getGroupInfo(auth)('id', parentID)
        .then(({objectId, mailNickname}) => ({objectId, mailNickname: `${mailNickname}.`}))
        // .tap(console.log('search Parent'))

const deleteAll = auth => 
    getDirectMembers(auth)(ICObjectID)


const create = auth => entry => 
    requestGraphAPI({
            params: {auth, json: entry},
            operator: 'createGroup',
    })
    // .then(({objectId}) => objectId)

const update = auth => ([id, entry]) => 
    requestGraphAPI({
        params: {auth, json: entry},
        operator: 'updateGroup',
        opts: {id},
    })
    .then(() => id)
    .tap(() => console.log(`[SUCCESS] updateGroup ${id}`))

const deleteGroup = auth => id => 
    requestGraphAPI({
        params : {auth},
        operator: 'deleteGroup',
        opts: {id},
    })
    .tap(() => console.log(`[SUCCESS] deleteGroup ${id}`))

const getDirectMembers = auth => id => 
    (!id && 'SUCCESS')
    || requestGraphAPI({
        params: {auth}, 
        operator: 'getMembers',
        opts: {id},
    })

const addMember = auth => ([id, memberId]) => 
    (!id && 'SUCCESS')
    || requestGraphAPI ({
        params: {auth, json:setContentAddMember(memberId)}, 
        operator: 'addMember',
        opts: {id},
    })

const deleteMember = auth => ([id, memberId]) => 
    requestGraphAPI ({
        params : {auth},
        operator: 'deleteMember',
        opts: {id, memberId},
    })

const isMemberOf = auth => ([groupId, memberId]) =>
    requestGraphAPI ({
        params: {auth, json:{groupId, memberId}}, 
        operator: 'isMemberOf',
    })

const groupEntity = {
    search,
    create, 
    update,
    deleteGroup,
    getDirectMembers,
    isMemberOf,
    addMember,
    deleteMember,
    setMailNickname, 
    getParentInfo,
    getGroupInfo,
    checkNotExist,
}

module.exports = groupEntity