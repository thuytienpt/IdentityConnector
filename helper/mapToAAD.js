
// const {SUCCESS} = require('../defaults/constants').ResponseStatus
const initialEntry = require ('../defaults/config').initialEntry
const mapAAD  = require('../defaults/mapAttributes')

const cleanEntry = data => Object.assign(data, {id: undefined})

const formatEmptyValue = value => (value === '' && ' ') || value
const reduceMapping = (map, data) => (entry, attr) => 
    (!data[attr] && entry)
    || Object.assign(entry, {[map[attr]] : formatEmptyValue(data[attr])})

const mappingAttributes = data => ([initEntry, map]) => 
    Promise.resolve(Object.keys(map))
    .reduce(reduceMapping(map, data), initEntry)

const mappingEntry = (entityType, data) => 
    Promise.all([
        initialEntry[entityType],
        mapAAD[entityType], 
    ])
    .then(mappingAttributes(data))

const mappingEntryModify = (entityType, data) =>  
    Promise.all([ 
        {}, 
        mapAAD[entityType] 
    ])
    .then(mappingAttributes(cleanEntry(data)))
    .then(entry => 
        (! Object.keys(entry)[0] && []) 
        || [data.objectId, entry]
    ) 
    
const setFuncMapping = isModify => 
    (isModify && mappingEntryModify) || mappingEntry

const createEntryAAD = (entityType, isModify) => data => 
    setFuncMapping(isModify)(entityType, data)


module.exports = {createEntryAAD}