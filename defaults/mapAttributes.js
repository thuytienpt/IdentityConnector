const appID = require('./config').app.id
const prefix = `extension_${appID}`

const gid = `${prefix}_gid`
const gcode = `${prefix}_gcode`
const parentId = `${prefix}_parentId`

// const uid = `${prefix}_uid`
const employeeCode = `${prefix}_employeeCode`
const departmentID = `${prefix}_departmentID`
const division     = `${prefix}_division`
const employeeType = `${prefix}_employeeType`
const wWWHomePage  = `${prefix}_wWWHomePage`


const Group = {
    id           : gid,
    orgCode      : gcode,
    parentId     : parentId,
    orgNameEN    : 'displayName',
    orgName      : 'description',
    mailNickname : 'mailNickname',
}
const User = {
id          : 'mailNickname',
empCode     : employeeCode,
// fullName    : 'displayName',
displayName : 'displayName',
firstName   : 'givenName',
lastName    : 'surname',
handPhone       : 'mobile',
// phone           : 'telephoneNumber',
telephoneNumber : 'telephoneNumber',
// locationAddress : 'streetAddress',
streetAddress   : 'streetAddress',
location        : 'physicalDeliveryOfficeName',
divisionName    : division,
departmentName  : 'department',
departmentNameID: departmentID,
avartar : 'thumbnailPhoto',
jobTitle: 'jobTitle',
empType : employeeType,
// workingEmail        : 'mail',
homePage            : wWWHomePage,
// domainAccount       : 'mailNickname',
userPrincipalName   : 'userPrincipalName',

}


module.exports = {
    Group,
    User,
}


