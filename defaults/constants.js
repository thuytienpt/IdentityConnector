
const Constants = {
    ResponseStatus: {
        SUCCESS  : 'success',
        FAILED   : 'failed', 
        BYPASSED : 'bypassed',
    },
    TypeEvent: {
        SNAP_ORG_CREATED  : 'snap_org_created',
        ORG_UPDATED       : 'org_updated',
        SNAP_USER_CREATED : 'snap_user_created',
        USER_CREATED      : 'user_created',
        USER_UPDATED      : 'user_updated',
        USER_MOVED        : 'user_moved'
    },
}

module.exports = Constants