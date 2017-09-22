const REGEX_PHONE = /\(\d+\)/g

const checkCaseModify = props =>  data => 
    Promise.all(props.map(data.hasOwnProperty))
    .then(result => result[0] || result[1])
    .then(isModify => isModify && props.map())

const normalizeTelephoneNumber = ({phone, ext}) => 
    Promise.resolve((ext && ` (${ext})`) || '')
    .then(ext => (phone && `${phone}${ext}`) || '')

const normalizeStreetAddress = ({locationAddress, seat}) => 
    Promise.resolve(parseSeat(seat))
    .then(seat => `${locationAddress} - Floor:${seat[0]} - Table:${seat[1]}`)

const normalizeDisplayName = ({firstName, lastName, domainAccount}) =>
    parseOrdinalNumber(domainAccount)
    .then(ordNum => `${firstName}. ${lastName}${ordNum}`)
    // .tap(console.log)

const parseSeat = seat => (seat && seat.slice(1).split('-'))|| ['n/a', 'n/a']

const isUpdate = value => value !== undefined

const updateExt = ext => telephoneNumber=>
    (!isUpdate(ext) && telephoneNumber) 
    || Promise.all([
        telephoneNumber.split(REGEX_PHONE)[0],
        (ext && `(${ext})`) || ''
    ])
    .then(([phone, ext]) => normalizeTelephoneNumber({phone, ext}))
    .then(console.log)

const updatePhone = phone => telephoneNumber=>
    (!isUpdate(phone) && telephoneNumber) 
    || Promise.all([
        phone,
        telephoneNumber.match(REGEX_PHONE) || '',
    ])
    .then(([phone, ext]) => normalizeTelephoneNumber({phone, ext}))
    .then(console.log)

const updateSeat = seat => streetAddress =>
    (!isUpdate(seat) && streetAddress) 
    || Promise.resolve(streetAddress.split(' - ')[0])
    .then(locationAddress => normalizeStreetAddress({locationAddress, seat}))
    .then(console.log)

const updateLocationAddress = locationAddress => streetAddress =>
    (!isUpdate(locationAddress) && streetAddress) 
    || Promise.all([
        locationAddress || '', 
        streetAddress.split(' - ').slice(1),
    ])
    .then(([locationAddress, seat]) => [locationAddress, ...seat].join(' - '))
    .then(console.log)

const parseOrdinalNumber = domainAccount => 
    Promise.resolve(domainAccount.match(/\d+/g))
    .then(num => (num && ` (${num[0]})`) || '')
    .tap(console.log)

const updateFirstName = firstName => displayName => 
    (!isUpdate(firstName) && displayName) 
    || displayName.replace(/\w+\./g, `${firstName}.`)

const updateLastName  = lastName => displayName => 
    (!isUpdate(lastName) && displayName) 
    || displayName.replace(/\.(\w+|\s?\w)+/g, `. ${lastName}`)

const updateBaseOnAAD =  data => ([attrAAD, attr0, attr1]) => 
    Promise.resolve(data.attrAAD)
    .then(mapFnUpdate[attr0](data[attr0]))
    .then(mapFnUpdate[attr1](data[attr1]))
    .then(updateValue => 
        ((updateValue !== value) && {[attrAAD]: updateValue}) 
        || {[attrAAD]: undefined}
    )
    // .tap(r => console.log(attr0, ' : ', r))

const mapFnUpdate = {
    firstName   : updateFirstName,
    lastName    : updateLastName,
    ext         : updateExt,
    phone       : updatePhone,
    seat        : updateSeat,
    locationAddress : updateLocationAddress,
}
const transform = data => 
    Promise.all([
        normalizeDisplayName(data), 
        normalizeStreetAddress(data),
        normalizeTelephoneNumber(data),
    ])
    .then(([displayName, streetAddress, telephoneNumber]) =>
        Object.assign(data, {displayName, streetAddress, telephoneNumber})
    )

const resolveNotUpdate = ([newValue, value]) => 
    ((newValue !== value) && newValue) || undefined

const transformToUpdate = data => 
    Promise.resolve([
        ['firstName', 'lastName'],
        ['seat', 'locationAddress'], 
        ['ext', 'phone']
    ])
    .map(updateBaseOnAAD(data))
    .then(([displayName, streetAddress, telephoneNumber]) =>
        Object.assign(data, displayName, streetAddress, telephoneNumber)
    )
    .tap(console.log)

const formatNullValue = value => value || ''

const transformNullValue = data => 
    Promise.resolve(Object.keys(data))
    .reduce((obj, attr) => 
        Promise.resolve(data[attr] || '')
        .then(value => Object.assign(obj, {[attr]: value})) 
    , {})
    // .tap(data => console.log('transformNullValue ', data))

module.exports = {
    transform,
    transformToUpdate, 
    transformNullValue,    
}