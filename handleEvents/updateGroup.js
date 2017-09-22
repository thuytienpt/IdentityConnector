
const {fileTeamInfo} = require ('../defaults/config')
const teamInfo = require(fileTeamInfo)

const { saveDataToFile } = require('../helper/fileIO')
const {createEntryAAD} = require('../helper/mapToAAD')

const {SUCCESS, FAILED, BYPASSED} = require('../defaults/constants').ResponseStatus
const {
    update, 
    addMember,
    deleteMember,
    isMemberOf,
    getGroupInfo,
} = require('../helper/groupEntity')

const parseOrgCode = ({mailNickname}) => mailNickname.split('.').slice(-1)

const deleteOldMembership = (auth, {mailNickname, objectId}) => 
    Promise.resolve(mailNickname.split('.').slice(-2, -1)[0])
    .then(parentCode => parentCode || Promise.reject(null))
    // .tap(oldParentCode  => console.log('oldParentCode = ', oldParentCode))
    .then(parentCode => getGroupInfo(auth)('orgCode', parentCode))
    // .tap(oldParent  => console.log('oldParent = ', oldParent))
    // .tap(parent => console.log([parent.objectId, objectId]))
    .then(parent => 
        deleteMember(auth)([parent.objectId, objectId]))
        .tap(() => console.log(`\t [SUCCESS] Delete Membership in oldParent`)
    )
    .catch(err => console.log(`\t [FAILED] Delete Membership in oldParent`))

const addNewMembership = auth => (data, parent) => 
    addMember(auth)([parent.objectId, data.objectId])
    .tap(() => console.log(`\t [SUCCESS] Add Membership in newParent`))
    .then(() => `${parent.mailNickname}.${parseOrgCode(data)}`)
    .then(mailNickname => Object.assign(data, {mailNickname}))

const moveGroup = auth => (data, parent) => 
    deleteOldMembership(auth, data)
    .tap(console.log('\t Move to New Group'))
    .tap(console.log('newParent = ', parent))
    .then(() => isMemberOf(auth)([parent.objectId, data.objectId]))
    // .tap(value => console.log('\t Add Membership ', value))
    .then(value => (value && data) || addNewMembership(auth)(data, parent))// not wait

const mapAtrrParent = {
    parentID    : 'id',
    parentCode  : 'orgCode',
    parentName  : 'orgName',
}

const hasParentAttr = key => data =>
    (data[key] && Promise.reject([mapAtrrParent[key], key])) || Promise.resolve(data)

const hasNewParent = auth => data => 
    Promise.resolve(data)
    .then(hasParentAttr('parentID'))
    .then(hasParentAttr('parentCode'))
    .then(hasParentAttr('parentName'))
    .tap(() => console.log('\t NO Move Group'))
    .then(() => null)
    .catch(([key, parentKey]) => 
        getGroupInfo(auth)(key, data[parentKey])
        .tap(console.log(data[parentKey]))
    )

const checkMoveGroup = auth => data => 
    hasNewParent(auth)(data)
    .then(parent => (parent && moveGroup(auth)(data, parent)) || data)

const updateMailNickname = data => 
    Promise.resolve(data.mailNickname.split('.').slice(0, -1))
    .then(prefix => prefix.concat(data.orgCode).join('.'))

const checkUpdateCode = data => 
    (data.orgCode && updateMailNickname(data)) || data.mailNickname

const resolveTeamGroup = id => 
    Promise.reject(BYPASSED)
    .tapCatch(console.log(`\t[ByPassed] Group ${teamInfo[id]} is TEAM`)) 

const checkTeam = ({id}) => 
    ((id in teamInfo) && resolveTeamGroup(id)) || {}

const updateGroup = data => auth => 
    Promise.resolve(data)
    .tap(console.log(`[UpdateGroup]:  ${data.id}`))
    .then(checkTeam)
    .then(() => getGroupInfo(auth)('id', data.id))
    .then(group => Object.assign(data, group, {AADmailNickname: group.mailNickname}))
    .then(checkMoveGroup(auth))
    .then(checkUpdateCode)
    .then(mailNickname => 
        ((mailNickname == data.AADmailNickname) && Object.assign(data, {mailNickname: undefined}))
        || Object.assign(data, {mailNickname})
    )
    .then(createEntryAAD('Group', true))
    // .tap(entry => console.log('\t EntryAAD: \n\t', entry))
    .then(info => (info[0] && update(auth)(info)) || Promise.reject(BYPASSED))
    .tap(() => console.log('\t[SUCCESS] Request Update Group '))


module.exports = {updateGroup}