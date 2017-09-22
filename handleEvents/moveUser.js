const {BYPASSED} = require('../defaults/constants').ResponseStatus
const {
    getGroupInfo,
    addMember,
    deleteMember,
} = require('../helper/groupEntity')

const {
    getUserInfo,
} = require('../helper/userEntity')


const checkIsMove = ({departmentID}) => 
    (departmentID && Promise.resolve(departmentID))
    || Promise.reject(BYPASSED)
        .tapCatch(console.log(`\t[ByPassed] No Move User to new group`))


const moveUser = data => auth => 
    Promise.resolve(data)
    .tap(() => console.log(`[MoveUser]:  ${data.id}`))
    .then(checkIsMove)
    .then(() => +new Date())
    .then(t => 
        Promise.resolve([
            getUserInfo(auth)('id', `IC_${data.id}`),
            getGroupInfo(auth)('id', data.oldDepartmentId),
            getGroupInfo(auth)('id', data.departmentID),
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
    .then(([user, oldDept, newDept]) => 
        ([  
            addMember(auth)([newDept.objectId, user.objectId]),
            deleteMember(auth)([oldDept.objectId, user.objectId]),
        ])
    )
    .all()
    // .then(console.log)
    .tap(() => console.log('\t[SUCCESS] Request Move User'))

module.exports = {moveUser}