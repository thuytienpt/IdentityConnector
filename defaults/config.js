
const proxy = 'http://10.30.76.11:3128'

const identityAPI = {
    url: 'http://10.60.35.35:8081/api/query/test_identity_queue',
    limitRequests: 10,
} 

const timeBased = {
    getEvents    : 10,
    handleEvents : 2,
}

const app = {
    id: '287fe60f4f404ba8ac349f85039c0490',
    objectId: '24dd31d1-4af2-45e9-b9bf-1a55a44c7d54',
}


const initialEntry = {
    Group: {
        mailEnabled: false,
        securityEnabled: true,
    },
    User: {
        accountEnabled: true,
        "passwordProfile": {
            "password": "Test1234",
            "forceChangePasswordNextLogin": true,
        },
        userType: 'Member'
    }
}

const fileTeamInfo = `${process.cwd()}/defaults/teamInfo.json`

module.exports = {
    proxy,
    identityAPI, 
    app,
    timeBased, 
    initialEntry,
    fileTeamInfo,
}

