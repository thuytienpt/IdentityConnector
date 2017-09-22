const { fileTeamInfo } = require ('../defaults/config')
// const initialEntry = require ('../defaults/config').initialEntry

const { saveDataToFile } = require('../helper/fileIO')
const { createEntryAAD } = require('../helper/mapToAAD')

const {SUCCESS, FAILED, BYPASSED} = require('../defaults/constants').ResponseStatus
const {
    create, 
    addMember,
    setMailNickname, 
    deleteGroup,
    checkNotExist,
    getParentInfo,
} = require('../helper/groupEntity')

const ICObjectID = 'db42fe92-b9d8-4914-91e2-df8322aa3a67'

const saveInvalidGroup = ({id, orgNameEN}) => 
    saveDataToFile(fileTeamInfo, {[id]: orgNameEN})
    .catch(err => Promise.reject().tapCatch(console.error(err)))
    .tap(console.log(`\t[ByPassed] Group ${orgNameEN} is TEAM`))
    .then(() => Promise.reject(BYPASSED))
    // .tapCatch(console.error)
    
const prepareData = (data, parent) =>  
    Promise.resolve(setMailNickname(data, parent))
    .tap(({mailNickname}) => console.log(mailNickname))
    .then(createEntryAAD('Group', false))
    // .tap(entry => console.log('\t [ENTRY]: \n \t', entry))


const insertToAAD = (data, auth) => parent => 
    prepareData(data, parent)
    .then(create(auth))
    .then(id => ([parent.objectId, id]))
    .tap(addMemberParam => console.log('\t[SUCCESS] Request Create Group objectId = ', addMemberParam[0]))


const checkValidGroup = data => 
    Promise.resolve((data.orgLevel!=='TEAM') && (data.orgLevel !== 'COMP')) 
    // .tap(console.log)
    .then(valid => valid || saveInvalidGroup(data))

const createGroup = data => auth => 
    Promise.resolve(data)
    .tap(() => console.log(`[CreateGroup]:  ${data.orgNameEN}`))
    .then(() => ([
            checkValidGroup(data),
            checkNotExist(auth)('id', data),
            getParentInfo(auth)(data)
            ])
    )
    .then(listPromises => 
        Promise.all(listPromises)
        .then(result => result[2])
        // .tapCatch(console.error)
        .catch(error => 
            Promise.reject(error)
            .tap(listPromises.map(p => p.cancel()))
        )
    )
    // .tap(parent => console.log('\t getParentInfo : ', parent))
    .then(insertToAAD(data, auth))
    .tap(([id, memberId]) => 
        addMember(auth)([ICObjectID, memberId])
        // .tap(console.log([id, memberId]))
    )
    .then(addMember(auth))
    .tap(() =>console.log('\t[SUCCESS] Request Add Member Group'))

module.exports = { createGroup }

