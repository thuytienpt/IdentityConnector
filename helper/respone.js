const {
    STATUS_SUCCESS,
    STATUS_FAILED,
    STATUS_BYPASSED
} = require('../defaults/responeCode')

const returnSuccess = data => Object({
    status: STATUS_SUCCESS,
    data  : data
})

const returnFailed = data => Object({
    status: STATUS_FAILED,
    data  : data
})

const returnByPassed = data => Object({
    status: STATUS_BYPASSED,
    data  : data
})

module.exports = {
    returnSuccess,
    returnFailed,
    returnByPassed
}